const Wishlist = require("../../../models/Wishlist");
const { cacheService } = require("../../../config/cache");
const logger = require("../../../utils/logger");

/**
 * Wishlist Repository
 */
class WishlistRepository {
  /**
   * Get user's wishlist
   */
  async getWishlist(userId) {
    try {
      const cacheKey = `wishlist:${userId}`;
      let wishlist = await cacheService.get(cacheKey);

      if (wishlist) {
        return wishlist;
      }

      wishlist = await Wishlist.findOne({ userId }).populate("books.bookId");

      if (wishlist) {
        await cacheService.set(cacheKey, wishlist, 1800); // 30 minutes
      }

      return wishlist;
    } catch (error) {
      logger.error(`Error getting wishlist: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add book to wishlist
   */
  async addBook(userId, bookId) {
    try {
      let wishlist = await Wishlist.findOne({ userId });

      if (!wishlist) {
        wishlist = await Wishlist.create({
          userId,
          books: [{ bookId }],
        });
      } else {
        // Check if book already in wishlist
        const exists = wishlist.books.some(
          (item) => item.bookId.toString() === bookId,
        );

        if (!exists) {
          wishlist.books.push({ bookId });
          await wishlist.save();
        }
      }

      // Invalidate cache
      await cacheService.delete(`wishlist:${userId}`);

      return wishlist;
    } catch (error) {
      logger.error(`Error adding to wishlist: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove book from wishlist
   */
  async removeBook(userId, bookId) {
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { books: { bookId } } },
        { new: true },
      );

      // Invalidate cache
      await cacheService.delete(`wishlist:${userId}`);

      return wishlist;
    } catch (error) {
      logger.error(`Error removing from wishlist: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if book is in wishlist
   */
  async isInWishlist(userId, bookId) {
    try {
      const wishlist = await Wishlist.findOne({
        userId,
        "books.bookId": bookId,
      });

      return wishlist !== null;
    } catch (error) {
      logger.error(`Error checking wishlist: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new WishlistRepository();
