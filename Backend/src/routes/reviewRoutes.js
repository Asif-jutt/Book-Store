const express = require("express");
const ReviewController = require("../../adapters/controllers/book/ReviewController");
const { authenticate } = require("../../middlewares/auth");
const {
  validateRequest,
  sanitizeInput,
} = require("../../middlewares/validation");

const router = express.Router();

router.use(sanitizeInput);

/**
 * Public Routes
 */

// Get all reviews for a book
// GET /api/reviews/book/:bookId?page=1&limit=10
router.get("/book/:bookId", ReviewController.getBookReviews);

/**
 * Authenticated Routes
 */

// Add or update review for a book
// POST /api/reviews/:bookId
router.post(
  "/book/:bookId",
  authenticate,
  validateRequest("createReview"),
  ReviewController.addReview,
);

// Get authenticated user's review for a book
// GET /api/reviews/user/:bookId
router.get("/user/mine/:bookId", authenticate, ReviewController.getUserReview);

// Mark review as helpful
// PATCH /api/reviews/:reviewId/helpful
router.patch("/:reviewId/helpful", authenticate, ReviewController.markHelpful);

// Delete review (user own or admin)
// DELETE /api/reviews/:reviewId
router.delete("/:reviewId", authenticate, ReviewController.deleteReview);

module.exports = router;
