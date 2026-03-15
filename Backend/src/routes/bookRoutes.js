const express = require("express");
const BookController = require("../../adapters/controllers/book/BookController");
const {
  authenticate,
  optionalAuth,
  authorize,
} = require("../../middlewares/auth");
const {
  validateRequest,
  sanitizeInput,
} = require("../../middlewares/validation");
const { searchLimiter } = require("../../middlewares/security");

const router = express.Router();

// Middleware
router.use(sanitizeInput);

/**
 * Public Routes (No authentication required)
 */

// Get all books with filters and pagination
// GET /api/books?page=1&limit=10&category=programming&genre=ai&sort=-createdAt
router.get("/", BookController.getAllBooks);

// Search books with full-text search
// GET /api/books/search?q=nodejs&category=programming
router.get(
  "/search",
  searchLimiter,
  validateRequest("search", "query"),
  BookController.searchBooks,
);

// Get popular/trending books
// GET /api/books/popular?limit=10
router.get("/popular", BookController.getPopularBooks);

// Get books by category
// GET /api/books/category/programming?page=1&limit=10
router.get("/category/:category", BookController.getBooksByCategory);

// Get single book by ID
// GET /api/books/:id
router.get("/:id", BookController.getBook);

/**
 * Admin Routes (Authentication + Admin role required)
 */

// Create new book
// POST /api/books
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validateRequest("createBook"),
  BookController.createBook,
);

// Update book
// PATCH /api/books/:id
router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest("updateBook"),
  BookController.updateBook,
);

// Delete book
// DELETE /api/books/:id
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  BookController.deleteBook,
);

module.exports = router;
