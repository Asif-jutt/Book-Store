const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("../config/environment");

// Helmet configuration for security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", config.API_URL],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

// CORS configuration
const corsConfig = {
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};

// Rate limiter configurations
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        code: "RATE_LIMIT_EXCEEDED",
      });
    },
  });
};

// Global API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  "Too many requests, please try again later",
);

// Auth route rate limiter (stricter)
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per 15 minutes
  "Too many login attempts, please try again later",
);

// Payment route rate limiter (very strict)
const paymentLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  20, // 20 requests per hour
  "Too many payment requests, please try again later",
);

// Search rate limiter
const searchLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  30, // 30 requests per minute
  "Search rate limit exceeded",
);

module.exports = {
  helmetConfig,
  corsConfig,
  apiLimiter,
  authLimiter,
  paymentLimiter,
  searchLimiter,
};
