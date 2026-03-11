const Book = require("../models/Book");
const Purchase = require("../models/Purchase");
const Order = require("../models/Order");

// Check if Stripe is properly configured
const isStripeConfigured =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith("sk_") &&
  !process.env.STRIPE_SECRET_KEY.includes("your_stripe");

// Initialize Stripe only if properly configured
let stripe = null;
if (isStripeConfigured) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

// Demo mode helper - simulates payment for testing
const DEMO_MODE = !isStripeConfigured;

const createCheckoutSession = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.category === "free") {
      return res.status(400).json({
        success: false,
        message: "This book is free. No payment required.",
      });
    }

    const existingPurchase = await Purchase.findOne({
      user: req.user._id,
      book: bookId,
      paymentStatus: "completed",
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this book",
      });
    }

    // DEMO MODE: Simulate successful payment without Stripe
    if (DEMO_MODE) {
      const demoSessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const demoPaymentIntentId = `demo_pi_${Date.now()}`;

      // Create completed purchase directly
      const purchase = await Purchase.create({
        user: req.user._id,
        book: bookId,
        price: book.price,
        currency: "usd",
        paymentStatus: "completed",
        paymentMethod: "demo",
        stripeSessionId: demoSessionId,
        transactionId: demoPaymentIntentId,
        accessGrantedAt: new Date(),
      });

      // Create order record
      await Order.create({
        user: req.user._id,
        book: bookId,
        amount: book.price,
        currency: "usd",
        paymentStatus: "paid",
        paymentMethod: "demo",
        stripeSessionId: demoSessionId,
        paymentId: demoPaymentIntentId,
        customerEmail: req.user.email,
        customerName: req.user.fullName,
        metadata: {
          bookTitle: book.title,
          bookAuthor: book.author,
          bookCategory: book.category,
        },
      });

      // Increment student count
      await Book.findByIdAndUpdate(bookId, {
        $inc: { totalStudents: 1 },
      });

      console.log("📚 DEMO MODE: Purchase completed for", book.title);

      // Redirect directly to success page
      return res.status(200).json({
        success: true,
        demoMode: true,
        sessionId: demoSessionId,
        url: `${process.env.FRONTEND_URL}/payment/success?session_id=${demoSessionId}&demo=true`,
        purchaseId: purchase._id,
        message:
          "Demo mode: Purchase completed instantly! (No real payment processed)",
      });
    }

    // PRODUCTION MODE: Use real Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      metadata: {
        bookId: bookId,
        userId: req.user._id.toString(),
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: book.title,
              description: book.description.substring(0, 500),
              images: book.thumbnail ? [book.thumbnail] : [],
            },
            unit_amount: Math.round(book.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?book_id=${bookId}`,
    });

    const purchase = await Purchase.create({
      user: req.user._id,
      book: bookId,
      price: book.price,
      currency: "usd",
      paymentStatus: "pending",
      paymentMethod: "stripe",
      stripeSessionId: session.id,
    });

    // Create order record
    await Order.create({
      user: req.user._id,
      book: bookId,
      amount: book.price,
      currency: "usd",
      paymentStatus: "pending",
      paymentMethod: "stripe",
      stripeSessionId: session.id,
      customerEmail: req.user.email,
      customerName: req.user.fullName,
      metadata: {
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCategory: book.category,
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      purchaseId: purchase._id,
    });
  } catch (error) {
    console.error("Payment session error:", error);
    res.status(500).json({
      success: false,
      message: DEMO_MODE
        ? "Demo mode error: " + error.message
        : "Payment error: " + error.message,
    });
  }
};

const handleWebhook = async (req, res) => {
  // In demo mode, webhooks are not needed
  if (!stripe) {
    console.log("Webhook received but Stripe not configured (demo mode)");
    return res.status(200).json({ received: true, demoMode: true });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log("Payment intent succeeded:", paymentIntent.id);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      await handleFailedPayment(paymentIntent);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

const handleSuccessfulPayment = async (session) => {
  try {
    const purchase = await Purchase.findOne({
      stripeSessionId: session.id,
    });

    if (purchase) {
      purchase.paymentStatus = "completed";
      purchase.transactionId = session.payment_intent;
      purchase.stripePaymentIntentId = session.payment_intent;
      purchase.accessGrantedAt = new Date();
      await purchase.save();

      // Update the corresponding order
      await Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          paymentStatus: "paid",
          paymentId: session.payment_intent,
          stripePaymentIntentId: session.payment_intent,
        },
      );

      await Book.findByIdAndUpdate(purchase.book, {
        $inc: { totalStudents: 1 },
      });

      console.log("Purchase completed:", purchase._id);
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
};

const handleFailedPayment = async (paymentIntent) => {
  try {
    const purchase = await Purchase.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (purchase) {
      purchase.paymentStatus = "failed";
      await purchase.save();
      console.log("Purchase failed:", purchase._id);

      // Update corresponding order
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: "failed" },
      );
    }
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Handle demo mode sessions
    if (sessionId.startsWith("demo_session_")) {
      const purchase = await Purchase.findOne({
        stripeSessionId: sessionId,
      }).populate("book", "title thumbnail");

      if (purchase) {
        return res.status(200).json({
          success: true,
          demoMode: true,
          message: "Demo payment verified successfully",
          purchase: purchase,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Demo purchase not found",
      });
    }

    // Handle real Stripe sessions
    if (!stripe) {
      return res.status(400).json({
        success: false,
        message:
          "Stripe is not configured. Please use demo mode or configure Stripe.",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const purchase = await Purchase.findOne({
        stripeSessionId: sessionId,
      }).populate("book", "title thumbnail");

      if (purchase && purchase.paymentStatus !== "completed") {
        purchase.paymentStatus = "completed";
        purchase.transactionId = session.payment_intent;
        purchase.stripePaymentIntentId = session.payment_intent;
        purchase.accessGrantedAt = new Date();
        await purchase.save();

        await Book.findByIdAndUpdate(purchase.book._id, {
          $inc: { totalStudents: 1 },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        purchase: purchase,
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment not completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate("book", "title image author price category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  verifyPayment,
  getPaymentHistory,
};
