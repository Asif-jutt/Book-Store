const morgan = require("morgan");
const logger = require("../utils/logger");

// Custom Morgan format
const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Custom Morgan stream to log with Winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Request logging middleware
const requestLogger = morgan(morganFormat, { stream });

// Request ID middleware - for distributed tracing
const requestId = (req, res, next) => {
  req.id = req.headers["x-request-id"] || `${Date.now()}-${Math.random()}`;
  res.setHeader("X-Request-ID", req.id);
  next();
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  requestLogger,
  requestId,
  asyncHandler,
};
