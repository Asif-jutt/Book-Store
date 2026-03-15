const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../../models/Order");
const Purchase = require("../../../models/Purchase");
const Book = require("../../../models/Book");
const { cacheService } = require("../../../config/cache");
const logger = require("../../../utils/logger");

/**
 * Stripe Payment Service
 */
class StripePaymentService {
  /**
   * Create payment intent
   */
  async createPaymentIntent(userId, items, metadata = {}) {
    try {
      // Calculate amount
      const amount = items.reduce((sum, item) => sum + item.price * 100, 0); // Convert to cents

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          userId,
          itemCount: items.length,
          ...metadata,
        },
        description: `Order for user ${userId}`,
      });

      logger.info(`Payment intent created: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        intentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      logger.error(`Error creating payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve payment intent
   */
  async getPaymentIntent(intentId) {
    try {
      return await stripe.paymentIntents.retrieve(intentId);
    } catch (error) {
      logger.error(`Error retrieving payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirm payment and create order
   */
  async confirmPayment(userId, intentId, items) {
    try {
      const paymentIntent = await this.getPaymentIntent(intentId);

      if (paymentIntent.status !== "succeeded") {
        throw new Error(
          `Payment not succeeded. Status: ${paymentIntent.status}`,
        );
      }

      // Create order
      const order = await Order.create({
        user: userId,
        books: items.map((item) => ({
          book: item.bookId,
          price: item.price,
        })),
        totalAmount: paymentIntent.amount / 100,
        paymentStatus: "paid",
        paymentMethod: "stripe",
        transactionId: intentId,
        approvalStatus: "approved",
        approvedAt: new Date(),
      });

      // Create purchases for each book
      for (const item of items) {
        await Purchase.create({
          user: userId,
          book: item.bookId,
          price: item.price,
          currency: "usd",
          paymentStatus: "completed",
          paymentMethod: "stripe",
          transactionId: intentId,
          accessGrantedAt: new Date(),
        });

        // Increment book sales count
        await Book.findByIdAndUpdate(item.bookId, {
          $inc: { totalStudents: 1, totalSales: item.price },
        });
      }

      // Invalidate caches
      await cacheService.delete(`cart:${userId}`);

      logger.info(`Order ${order._id} created after successful payment`);

      return order;
    } catch (error) {
      logger.error(`Error confirming payment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle webhook event (payment.intent.succeeded)
   */
  async handlePaymentIntentSucceeded(event) {
    try {
      const paymentIntent = event.data.object;
      const { userId } = paymentIntent.metadata;

      logger.info(`Payment succeeded for user ${userId}: ${paymentIntent.id}`);

      // Payment already confirmed in confirmPayment(), but webhook provides extra safety
      return {
        success: true,
        intentId: paymentIntent.id,
        userId,
      };
    } catch (error) {
      logger.error(`Error handling payment.intent.succeeded: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle webhook event (payment.intent.payment_failed)
   */
  async handlePaymentIntentFailed(event) {
    try {
      const paymentIntent = event.data.object;
      const { userId } = paymentIntent.metadata;

      logger.warn(`Payment failed for user ${userId}: ${paymentIntent.id}`);
      logger.warn(
        `Failure reason: ${paymentIntent.last_payment_error?.message}`,
      );

      return {
        success: false,
        intentId: paymentIntent.id,
        userId,
        reason: paymentIntent.last_payment_error?.message,
      };
    } catch (error) {
      logger.error(
        `Error handling payment.intent.payment_failed: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(intentId, reason) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: intentId,
        reason,
      });

      logger.info(`Refund created: ${refund.id} for intent ${intentId}`);

      return refund;
    } catch (error) {
      logger.error(`Error creating refund: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId, limit = 10) {
    try {
      const charges = await stripe.charges.list({
        limit,
      });

      return charges.data.filter(
        (charge) => charge.metadata?.userId === userId,
      );
    } catch (error) {
      logger.error(`Error getting payment history: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new StripePaymentService();
