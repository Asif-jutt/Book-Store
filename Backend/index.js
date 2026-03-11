const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const {
  apiLimiter,
  authLimiter,
  paymentLimiter,
} = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const bookRoutes = require("./routes/bookRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { handleWebhook } = require("./controllers/paymentController");

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

app.use(cors());
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

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     BOOKSTORE API SERVER STARTED           ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                               ║
║  Mode: ${process.env.NODE_ENV || "development"}                      ║
║  URL:  http://localhost:${PORT}               ║
╚════════════════════════════════════════════╝
  `);
});
