const Review = require("../../../models/Review");
const Book = require("../../../models/Book");
const { cacheService } = require("../../../config/cache");
const logger = require("../../../utils/logger");

/**
 * Review Repository
 */
class ReviewRepository {
  /**
   * Create or update review
   */
  async createOrUpdate(userId, bookId, reviewData) {
    try {
      let review = await Review.findOne({ userId, bookId });

      if (review) {
        // Update existing review
        Object.assign(review, reviewData);
        await review.save();
      } else {
        // Create new review
        review = await Review.create({
          userId,
          bookId,
          ...reviewData,
        });
      }

      // Invalidate cache
      await cacheService.delete(`reviews:book:${bookId}`);
      await cacheService.delete(`ratings:book:${bookId}`);

      // Update book ratings
      await this.updateBookRatings(bookId);

      return review;
    } catch (error) {
      logger.error(`Error creating/updating review: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all reviews for a book
   */
  async getReviewsByBook(bookId, page = 1, limit = 10) {
    try {
      const cacheKey = `reviews:book:${bookId}:page:${page}`;
      let result = await cacheService.get(cacheKey);

      if (result) {
        return result;
      }

      const skip = (page - 1) * limit;
      const total = await Review.countDocuments({ bookId, status: "approved" });

      const reviews = await Review.find({ bookId, status: "approved" })
        .populate("userId", "fullName profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      result = {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };

      // Cache for 30 minutes
      await cacheService.set(cacheKey, result, 1800);

      return result;
    } catch (error) {
      logger.error(
        `Error getting reviews for book ${bookId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get user's review for a book
   */
  async getUserReview(userId, bookId) {
    try {
      return await Review.findOne({ userId, bookId }).populate(
        "userId",
        "fullName",
      );
    } catch (error) {
      logger.error(`Error getting user review: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update book's average rating
   */
  async updateBookRatings(bookId) {
    try {
      const stats = await Review.aggregate([
        {
          $match: {
            bookId: require("mongoose").Types.ObjectId(bookId),
            status: "approved",
          },
        },
        {
          $group: {
            _id: "$bookId",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: "$rating",
            },
          },
        },
      ]);

      if (stats.length > 0) {
        const { avgRating, totalReviews } = stats[0];

        await Book.findByIdAndUpdate(bookId, {
          ratingAvg: Math.round(avgRating * 10) / 10,
          ratingCount: totalReviews,
        });

        // Clear cache
        await cacheService.delete(`book:${bookId}`);
      }
    } catch (error) {
      logger.error(`Error updating book ratings: ${error.message}`);
    }
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId) {
    try {
      return await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { helpful: 1 } },
        { new: true },
      );
    } catch (error) {
      logger.error(`Error marking review helpful: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete review
   */
  async delete(reviewId) {
    try {
      const review = await Review.findByIdAndDelete(reviewId);

      if (review) {
        // Update book ratings
        await this.updateBookRatings(review.bookId);
        await cacheService.delete(`reviews:book:${review.bookId}`);
      }

      return review;
    } catch (error) {
      logger.error(`Error deleting review: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReviewRepository();
