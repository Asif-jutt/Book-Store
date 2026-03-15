const express = require("express");
const {
  cart: cartController,
  wishlist: wishlistController,
} = require("../../adapters/controllers/CartWishlistController");
const { authenticate } = require("../../middlewares/auth");
const {
  validateRequest,
  sanitizeInput,
} = require("../../middlewares/validation");

const router = express.Router();

router.use(sanitizeInput);
router.use(authenticate); // All cart/wishlist routes require authentication

/**
 * Cart Routes
 */

// Get user's cart
router.get("/cart", cartController.getCart);

// Add item to cart
router.post("/cart", validateRequest("cartItem"), cartController.addToCart);

// Update cart item quantity
router.patch(
  "/cart/:bookId",
  validateRequest("cartItem"),
  cartController.updateCartItem,
);

// Remove item from cart
router.delete("/cart/:bookId", cartController.removeFromCart);

// Clear entire cart
router.delete("/cart", cartController.clearCart);

// Get cart totals
router.get("/cart/totals", cartController.getCartTotal);

/**
 * Wishlist Routes
 */

// Get user's wishlist
router.get("/wishlist", wishlistController.getWishlist);

// Add book to wishlist
router.post(
  "/wishlist",
  validateRequest("wishlistItem"),
  wishlistController.addToWishlist,
);

// Remove book from wishlist
router.delete("/wishlist/:bookId", wishlistController.removeFromWishlist);

// Check if book is in wishlist
router.get("/wishlist/:bookId/check", wishlistController.isInWishlist);

module.exports = router;
