/**
 * Input validation middleware
 * Production-ready input validation for API routes
 */

const validateSignup = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];

  // Validate full name
  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }
  if (fullName && fullName.length > 50) {
    errors.push("Full name must be less than 50 characters");
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateBook = (req, res, next) => {
  const { title, author, description, category, price } = req.body;
  const errors = [];

  // Required fields
  if (!title || title.trim().length < 2) {
    errors.push("Title must be at least 2 characters");
  }

  if (!author || author.trim().length < 2) {
    errors.push("Author name must be at least 2 characters");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }

  // Category validation
  const validCategories = ["free", "paid", "premium"];
  if (!category || !validCategories.includes(category)) {
    errors.push("Category must be one of: free, paid, premium");
  }

  // Price validation for non-free books
  if (category !== "free") {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      errors.push("Price must be a valid positive number");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validatePasswordUpdate = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push("Current password is required");
  }

  if (!newPassword || newPassword.length < 6) {
    errors.push("New password must be at least 6 characters");
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push("New password must be different from current password");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { fullName, bio } = req.body;
  const errors = [];

  if (fullName !== undefined) {
    if (fullName.trim().length < 2) {
      errors.push("Full name must be at least 2 characters");
    }
    if (fullName.length > 50) {
      errors.push("Full name must be less than 50 characters");
    }
  }

  if (bio !== undefined && bio.length > 200) {
    errors.push("Bio must be less than 200 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!id || !objectIdRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};

// Sanitize input - remove potentially dangerous characters
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      // Remove potential XSS characters
      return obj.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        "",
      );
    }
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateBook,
  validatePasswordUpdate,
  validateProfileUpdate,
  validateObjectId,
  sanitizeInput,
};
