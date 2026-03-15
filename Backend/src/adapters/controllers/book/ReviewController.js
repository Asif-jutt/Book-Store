const ReviewUseCases = require("../../usecases/review/ReviewUseCases");
const { asyncHandler } = require("../../middlewares/logging");
const logger = require("../../utils/logger");

/**
 * Review Controller
 */
const addReview = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  logger.debug(`Adding review for book ${bookId} by user ${userId}`);
  const review = await ReviewUseCases.addReview(userId, bookId, {
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
  });
});

const getBookReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await ReviewUseCases.getBookReviews(
    bookId,
    parseInt(page),
    parseInt(limit),
  );

  res.status(200).json({
    success: true,
    data: result.reviews,
    pagination: result.pagination,
  });
});

const getUserReview = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  const review = await ReviewUseCases.getUserReview(userId, bookId);

  res.status(200).json({
    success: true,
    data: review,
  });
});

const markHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  logger.debug(`Marking review ${reviewId} as helpful`);
  const review = await ReviewUseCases.markHelpful(reviewId);

  res.status(200).json({
    success: true,
    message: "Review marked as helpful",
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  logger.debug(`Deleting review ${reviewId}`);
  await ReviewUseCases.deleteReview(reviewId, userId, userRole);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  addReview,
  getBookReviews,
  getUserReview,
  markHelpful,
  deleteReview,
};
