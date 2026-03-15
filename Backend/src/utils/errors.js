const logger = require("./logger");

class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTH_ERROR");
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "PERMISSION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, "CONFLICT");
  }
}

class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, "SERVER_ERROR");
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",
    timestamp: err.timestamp || new Date().toISOString(),
  };

  if (err.errors) {
    error.errors = err.errors;
  }

  // Log error
  if (error.statusCode >= 500) {
    logger.error(`[${error.statusCode}] ${error.message}`, {
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn(`[${error.statusCode}] ${error.message}`, {
      path: req.path,
      method: req.method,
    });
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === "production" && error.statusCode === 500) {
    error.message = "Internal Server Error";
  }

  res.status(error.statusCode).json({
    success: false,
    ...error,
  });
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  ServerError,
  errorHandler,
};
