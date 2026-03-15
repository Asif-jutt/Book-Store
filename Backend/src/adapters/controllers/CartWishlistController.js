const {
  CartUseCases,
  WishlistUseCases,
} = require("../../usecases/CartWishlistUseCases");
const { asyncHandler } = require("../../middlewares/logging");
const logger = require("../../utils/logger");

/**
 * Cart Controller
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await CartUseCases.getCart(userId);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bookId, quantity = 1 } = req.body;

  logger.debug(
    `Adding to cart: book=${bookId}, qty=${quantity}, user=${userId}`,
  );
  const cart = await CartUseCases.addItem(userId, bookId, quantity);

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;
  const { quantity } = req.body;

  logger.debug(`Updating cart item: book=${bookId}, qty=${quantity}`);
  const cart = await CartUseCases.updateItem(userId, bookId, quantity);

  res.status(200).json({
    success: true,
    message: "Cart item updated",
    data: cart,
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  logger.debug(`Removing from cart: book=${bookId}`);
  const cart = await CartUseCases.removeItem(userId, bookId);

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  logger.debug(`Clearing cart for user ${userId}`);
  const cart = await CartUseCases.clearCart(userId);

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    data: cart,
  });
});

const getCartTotal = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const totals = await CartUseCases.getCartTotal(userId);

  res.status(200).json({
    success: true,
    data: totals,
  });
});

/**
 * Wishlist Controller
 */
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wishlist = await WishlistUseCases.getWishlist(userId);

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.body;

  logger.debug(`Adding to wishlist: book=${bookId}, user=${userId}`);
  const wishlist = await WishlistUseCases.addBook(userId, bookId);

  res.status(200).json({
    success: true,
    message: "Book added to wishlist",
    data: wishlist,
  });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  logger.debug(`Removing from wishlist: book=${bookId}`);
  const wishlist = await WishlistUseCases.removeBook(userId, bookId);

  res.status(200).json({
    success: true,
    message: "Book removed from wishlist",
    data: wishlist,
  });
});

const isInWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  const inWishlist = await WishlistUseCases.isInWishlist(userId, bookId);

  res.status(200).json({
    success: true,
    data: { inWishlist },
  });
});

module.exports = {
  cart: {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
  },
  wishlist: {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  },
};
