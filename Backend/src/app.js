require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Configuration
const config = require("./config/environment");
const { connectDB } = require("./config/database");
const { initializeRedis } = require("./config/cache");

// Middleware
const {
  helmetConfig,
  corsConfig,
  apiLimiter,
  authLimiter,
  paymentLimiter,
  searchLimiter,
} = require("./middlewares/security");
const {
  requestLogger,
  requestId,
  asyncHandler,
} = require("./middlewares/logging");
const { errorHandler } = require("./utils/errors");
const logger = require("./utils/logger");

// Routes
const authRoutes = require("../../routes/authRoutes");
const userRoutes = require("../../routes/userRoutes");
const fileRoutes = require("../../routes/fileRoutes");
const paymentRoutes = require("../../routes/paymentRoutes");
const purchaseRoutes = require("../../routes/purchaseRoutes");
const orderRoutes = require("../../routes/orderRoutes");
const securePdfRoutes = require("../../routes/securePdfRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartWishlistRoutes = require("./routes/cartWishlistRoutes");

// Initialize Express app
const app = express();

// ========================
// GLOBAL MIDDLEWARE SETUP
// ========================

// Security middleware
app.use(helmetConfig);
app.use(cors(corsConfig));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Request tracking and logging
app.use(requestId);
app.use(requestLogger);

// Rate limiting (apply to API routes)
app.use("/api/", apiLimiter);
app.use("/api/auth/", authLimiter);
app.use("/api/payment/", paymentLimiter);
app.use("/api/books/search", searchLimiter);

// ========================
// HEALTH CHECK ENDPOINTS
// ========================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

app.get(
  "/ready",
  asyncHandler(async (req, res) => {
    // Check database connection
    const dbConnected = require("mongoose").connection.readyState === 1;

    if (!dbConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not ready",
      });
    }

    res.status(200).json({
      success: true,
      message: "API is ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  }),
);

// ========================
// API ROUTES
// ========================

// Auth (login/register/etc.)
app.use("/api/auth", authLimiter, authRoutes);

// User profiles, admin user management
app.use("/api/user", userRoutes);

// File uploads and downloads
app.use("/api/files", fileRoutes);

// Books (listing, search, etc.)
app.use("/api/books", bookRoutes);

// Cart/wishlist
app.use("/api", cartWishlistRoutes);

// Reviews
app.use("/api/reviews", reviewRoutes);

// Payments and transactions
app.use("/api/payment", paymentLimiter, paymentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/secure-pdf", securePdfRoutes);

// Note: Additional route modules can be added here as needed.

// ========================
// SWAGGER DOCUMENTATION
// ========================

// To be implemented with swagger-jsdoc

// ========================
// 404 & ERROR HANDLING
// ========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
    method: req.method,
    code: "NOT_FOUND",
  });
});

// Global error handler (MUST be last)
app.use(errorHandler);

// ========================
// SERVER INITIALIZATION
// ========================

const PORT = config.PORT;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info("Database connection successful");

    // Initialize Redis
    await initializeRedis();
    logger.info("Redis connection successful");

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on ${config.API_URL}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(async () => {
        await require("./src/config/database").disconnectDB();
        logger.info("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close(async () => {
        await require("./src/config/database").disconnectDB();
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
