const ReviewRepository = require("../../adapters/repositories/ReviewRepository");
const BookRepository = require("../../adapters/repositories/BookRepository");
const { NotFoundError, ValidationError } = require("../../utils/errors");
const logger = require("../../utils/logger");

/**
 * Review Use Cases
 */
class ReviewUseCases {
  /**
   * Add or update review
   */
  async addReview(userId, bookId, reviewData) {
    try {
      // Validate book exists
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new NotFoundError("Book");
      }

      // Validate rating
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new ValidationError("Invalid rating", [
          { field: "rating", message: "Rating must be between 1 and 5" },
        ]);
      }

      const review = await ReviewRepository.createOrUpdate(userId, bookId, {
        rating: reviewData.rating,
        comment: reviewData.comment || "",
      });

      return review;
    } catch (error) {
      logger.error(`Error adding review: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get reviews for a book
   */
  async getBookReviews(bookId, page = 1, limit = 10) {
    try {
      // Validate book exists
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new NotFoundError("Book");
      }

      return await ReviewRepository.getReviewsByBook(bookId, page, limit);
    } catch (error) {
      logger.error(`Error getting reviews: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user's review for a book
   */
  async getUserReview(userId, bookId) {
    try {
      return await ReviewRepository.getUserReview(userId, bookId);
    } catch (error) {
      logger.error(`Error getting user review: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId) {
    try {
      return await ReviewRepository.markHelpful(reviewId);
    } catch (error) {
      logger.error(`Error marking helpful: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete review (user own review or admin)
   */
  async deleteReview(reviewId, userId, userRole) {
    try {
      // Fetch review to check ownership
      const review = await ReviewRepository.getUserReview(userId, null);

      if (!review) {
        throw new NotFoundError("Review");
      }

      if (review.userId.toString() !== userId && userRole !== "admin") {
        throw new Error("Unauthorized to delete this review");
      }

      return await ReviewRepository.delete(reviewId);
    } catch (error) {
      logger.error(`Error deleting review: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReviewUseCases();
