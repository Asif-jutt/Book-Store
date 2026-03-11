/**
 * API Response Helper Utilities
 * Standardized response format for all API endpoints
 */

class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @param {Object} meta - Additional metadata (pagination, etc.)
   */
  static success(
    res,
    statusCode = 200,
    message = "Success",
    data = null,
    meta = {},
  ) {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    if (Object.keys(meta).length > 0) {
      Object.assign(response, meta);
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Array of error details
   */
  static error(
    res,
    statusCode = 500,
    message = "An error occurred",
    errors = [],
  ) {
    const response = {
      success: false,
      message,
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Paginated response
   * @param {Object} res - Express response object
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination info
   */
  static paginated(res, data, pagination) {
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
      pagination,
    });
  }

  /**
   * Created response (201)
   */
  static created(res, message, data) {
    return this.success(res, 201, message, data);
  }

  /**
   * Not found response (404)
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, 404, message);
  }

  /**
   * Unauthorized response (401)
   */
  static unauthorized(res, message = "Not authorized") {
    return this.error(res, 401, message);
  }

  /**
   * Forbidden response (403)
   */
  static forbidden(res, message = "Access denied") {
    return this.error(res, 403, message);
  }

  /**
   * Bad request response (400)
   */
  static badRequest(res, message = "Bad request", errors = []) {
    return this.error(res, 400, message, errors);
  }

  /**
   * Validation error response (422)
   */
  static validationError(res, errors) {
    return this.error(res, 422, "Validation failed", errors);
  }

  /**
   * Internal server error response (500)
   */
  static serverError(res, message = "Internal server error") {
    return this.error(res, 500, message);
  }
}

/**
 * Async handler wrapper to catch errors
 * @param {Function} fn - Async function to wrap
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Calculate pagination values
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 */
const getPagination = (page = 1, limit = 10, total = 0) => {
  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(limit, 10) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Pick specific fields from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 */
const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**
 * Omit specific fields from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 */
const omit = (obj, keys) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

module.exports = {
  ApiResponse,
  asyncHandler,
  getPagination,
  pick,
  omit,
};
