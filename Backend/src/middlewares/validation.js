const { validate, schemas } = require("../utils/validation");
const { ValidationError } = require("../utils/errors");
const logger = require("../utils/logger");

// Factory function to create validation middleware
const validateRequest = (schemaKey, source = "body") => {
  return (req, res, next) => {
    try {
      if (!schemas[schemaKey]) {
        logger.error(`Validation schema not found: ${schemaKey}`);
        return res.status(500).json({
          success: false,
          message: "Internal validation error",
          code: "VALIDATION_ERROR",
        });
      }

      const dataToValidate = source === "body" ? req.body : req.query;
      const result = validate(schemas[schemaKey], dataToValidate);

      if (!result.valid) {
        logger.warn(`Validation failed for ${schemaKey}:`, result.errors);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          errors: result.errors,
        });
      }

      // Attach validated data to request
      if (source === "body") {
        req.body = result.data;
      } else {
        req.query = result.data;
      }

      next();
    } catch (error) {
      logger.error(`Validation middleware error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Internal validation error",
        code: "SERVER_ERROR",
      });
    }
  };
};

// Sanitize input to prevent XSS
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      return obj
        .replace(/[<>]/g, "") // Remove HTML tags
        .trim();
    }
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

module.exports = {
  validateRequest,
  sanitizeInput,
};
