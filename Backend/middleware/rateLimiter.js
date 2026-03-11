/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP
 */

const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth routes (login, signup)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per 15 minutes
  message: {
    success: false,
    message:
      "Too many login attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Limiter for payment routes
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 payment attempts per hour
  message: {
    success: false,
    message: "Too many payment attempts from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 uploads per hour
  message: {
    success: false,
    message: "Too many file uploads from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for password change/reset
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 password changes per hour
  message: {
    success: false,
    message: "Too many password change attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create custom limiter
const createLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      message: options.message || "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter,
  uploadLimiter,
  passwordLimiter,
  createLimiter,
};
