/**
 * Form validation utilities for frontend
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 6 chars, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Strong password validation
export const isStrongPassword = (password) => {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

// Price validation
export const isValidPrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0;
};

// Form field validators
export const validators = {
  required: (value, fieldName = "Field") => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return "Email is required";
    if (!isValidEmail(value)) return "Please enter a valid email address";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  },

  name: (value) => {
    if (!value || !value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (value.trim().length > 50) return "Name must be less than 50 characters";
    return null;
  },

  price: (value, category) => {
    if (category === "free") return null;
    if (!value && value !== 0) return "Price is required";
    const numPrice = parseFloat(value);
    if (isNaN(numPrice)) return "Please enter a valid price";
    if (numPrice < 0) return "Price cannot be negative";
    return null;
  },
};

// Validate entire form
export const validateForm = (formData, rules) => {
  const errors = {};

  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(formData[field], formData);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Format price
export const formatPrice = (price, currency = "USD") => {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(price);
};

// Format date
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  return new Date(dateString).toLocaleDateString("en-US", defaultOptions);
};

// Format duration
export const formatDuration = (minutes) => {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

// Slugify text
export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
