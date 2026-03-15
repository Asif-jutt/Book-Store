// Load environment variables
require("dotenv").config();

// Start the application from the new enhanced app.js
const app = require("./src/app");

// For backward compatibility, export the app
module.exports = app;

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const bookRoutes = require("./routes/bookRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const orderRoutes = require("./routes/orderRoutes");
const securePdfRoutes = require("./routes/securePdfRoutes");
const { handleWebhook } = require("./controllers/paymentController");
const Order = require("./models/Order");
const Purchase = require("./models/Purchase");
const Book = require("./models/Book");

connectDB();

const app = express();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Apply rate limiting to API routes
app.use("/api/", apiLimiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Bookstore API",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      files: "/api/files",
      books: "/api/books",
      payment: "/api/payment",
      purchases: "/api/purchases",
      orders: "/api/orders",
    },
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/payment", paymentLimiter, paymentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/secure-pdf", securePdfRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

// Start server only when not imported (for Vercel serverless compatibility)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`
╔════════════════════════════════════════════╗
║     BOOKSTORE API SERVER STARTED           ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                               ║
║  Mode: ${process.env.NODE_ENV || "development"}                      ║
║  URL:  http://localhost:${PORT}               ║
╚════════════════════════════════════════════╝
    `);

    // One-time migration: auto-approve old pending orders and grant access
    try {
      const pendingOrders = await Order.find({
        approvalStatus: "pending",
        paymentMethod: "demo",
      });
      if (pendingOrders.length > 0) {
        for (const order of pendingOrders) {
          order.paymentStatus = "paid";
          order.approvalStatus = "approved";
          order.approvedAt = new Date();
          await order.save();

          // Ensure a completed Purchase exists
          const existingPurchase = await Purchase.findOne({
            user: order.user,
            book: order.book,
            paymentStatus: "completed",
          });
          if (!existingPurchase) {
            await Purchase.create({
              user: order.user,
              book: order.book,
              price: order.amount,
              currency: order.currency || "usd",
              paymentStatus: "completed",
              paymentMethod: "demo",
              transactionId: order.paymentId || `migrated_${order._id}`,
              accessGrantedAt: new Date(),
            });
            await Book.findByIdAndUpdate(order.book, {
              $inc: { totalStudents: 1 },
            });
          }
        }
        console.log(
          `✅ Migrated ${pendingOrders.length} pending demo orders to approved`,
        );
      }
    } catch (err) {
      console.error("Migration error (non-fatal):", err.message);
    }
  });
}

// Export for Vercel serverless
module.exports = app;
