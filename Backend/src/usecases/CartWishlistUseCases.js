const CartRepository = require("../../adapters/repositories/CartRepository");
const WishlistRepository = require("../../adapters/repositories/WishlistRepository");
const BookRepository = require("../../adapters/repositories/BookRepository");
const { NotFoundError, ValidationError } = require("../../utils/errors");
const logger = require("../../utils/logger");

/**
 * Cart Use Cases
 */
class CartUseCases {
  async getCart(userId) {
    try {
      return await CartRepository.getCart(userId);
    } catch (error) {
      logger.error(`Error getting cart: ${error.message}`);
      throw error;
    }
  }

  async addItem(userId, bookId, quantity = 1) {
    try {
      // Validate book exists
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new NotFoundError("Book");
      }

      if (quantity < 1) {
        throw new ValidationError("Invalid quantity", [
          { field: "quantity", message: "Quantity must be at least 1" },
        ]);
      }

      return await CartRepository.addItem(userId, bookId, quantity);
    } catch (error) {
      logger.error(`Error adding to cart: ${error.message}`);
      throw error;
    }
  }

  async updateItem(userId, bookId, quantity) {
    try {
      if (quantity < 0) {
        throw new ValidationError("Invalid quantity", [
          { field: "quantity", message: "Quantity must be >= 0" },
        ]);
      }

      return await CartRepository.updateItem(userId, bookId, quantity);
    } catch (error) {
      logger.error(`Error updating cart item: ${error.message}`);
      throw error;
    }
  }

  async removeItem(userId, bookId) {
    try {
      return await CartRepository.removeItem(userId, bookId);
    } catch (error) {
      logger.error(`Error removing from cart: ${error.message}`);
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      return await CartRepository.clearCart(userId);
    } catch (error) {
      logger.error(`Error clearing cart: ${error.message}`);
      throw error;
    }
  }

  async getCartTotal(userId) {
    try {
      return await CartRepository.getCartTotal(userId);
    } catch (error) {
      logger.error(`Error getting cart total: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Wishlist Use Cases
 */
class WishlistUseCases {
  async getWishlist(userId) {
    try {
      return await WishlistRepository.getWishlist(userId);
    } catch (error) {
      logger.error(`Error getting wishlist: ${error.message}`);
      throw error;
    }
  }

  async addBook(userId, bookId) {
    try {
      // Validate book exists
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new NotFoundError("Book");
      }

      return await WishlistRepository.addBook(userId, bookId);
    } catch (error) {
      logger.error(`Error adding to wishlist: ${error.message}`);
      throw error;
    }
  }

  async removeBook(userId, bookId) {
    try {
      return await WishlistRepository.removeBook(userId, bookId);
    } catch (error) {
      logger.error(`Error removing from wishlist: ${error.message}`);
      throw error;
    }
  }

  async isInWishlist(userId, bookId) {
    try {
      return await WishlistRepository.isInWishlist(userId, bookId);
    } catch (error) {
      logger.error(`Error checking wishlist: ${error.message}`);
      throw error;
    }
  }
}

module.exports = {
  CartUseCases: new CartUseCases(),
  WishlistUseCases: new WishlistUseCases(),
};
