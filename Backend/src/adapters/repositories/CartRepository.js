const Cart = require("../../../models/Cart");
const Book = require("../../../models/Book");
const { cacheService } = require("../../../config/cache");
const logger = require("../../../utils/logger");

/**
 * Cart Repository
 */
class CartRepository {
  /**
   * Get user's cart
   */
  async getCart(userId) {
    try {
      const cacheKey = `cart:${userId}`;
      let cart = await cacheService.get(cacheKey);

      if (cart) {
        return cart;
      }

      cart = await Cart.findOne({ userId }).populate("items.bookId");

      if (!cart) {
        cart = await Cart.create({
          userId,
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
        });
      }

      // Cache for 1 hour
      await cacheService.set(cacheKey, cart, 3600);

      return cart;
    } catch (error) {
      logger.error(`Error getting cart: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add item to cart
   */
  async addItem(userId, bookId, quantity = 1) {
    try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        // Get book price
        const book = await Book.findById(bookId);
        if (!book) throw new Error("Book not found");

        cart = await Cart.create({
          userId,
          items: [
            {
              bookId,
              quantity,
              priceSnapshot: book.price,
            },
          ],
        });
      } else {
        // Check if item already in cart
        const existingItem = cart.items.find(
          (item) => item.bookId.toString() === bookId,
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          // Get book price
          const book = await Book.findById(bookId);
          if (!book) throw new Error("Book not found");

          cart.items.push({
            bookId,
            quantity,
            priceSnapshot: book.price,
          });
        }

        await cart.save();
      }

      // Invalidate cache
      await cacheService.delete(`cart:${userId}`);

      return cart;
    } catch (error) {
      logger.error(`Error adding to cart: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateItem(userId, bookId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeItem(userId, bookId);
      }

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        throw new Error("Cart not found");
      }

      const item = cart.items.find((i) => i.bookId.toString() === bookId);

      if (!item) {
        throw new Error("Item not in cart");
      }

      item.quantity = quantity;
      await cart.save();

      // Invalidate cache
      await cacheService.delete(`cart:${userId}`);

      return cart;
    } catch (error) {
      logger.error(`Error updating cart item: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId, bookId) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { bookId } } },
        { new: true },
      );

      // Invalidate cache
      await cacheService.delete(`cart:${userId}`);

      return cart;
    } catch (error) {
      logger.error(`Error removing from cart: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear cart
   */
  async clearCart(userId) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        {
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
        },
        { new: true },
      );

      // Invalidate cache
      await cacheService.delete(`cart:${userId}`);

      return cart;
    } catch (error) {
      logger.error(`Error clearing cart: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get cart total
   */
  async getCartTotal(userId) {
    try {
      const cart = await this.getCart(userId);
      return {
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        itemCount: cart.items.length,
      };
    } catch (error) {
      logger.error(`Error getting cart total: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CartRepository();
