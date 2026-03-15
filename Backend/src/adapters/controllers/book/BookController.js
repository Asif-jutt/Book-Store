const BookUseCases = require("../../usecases/book/BookUseCases");
const { asyncHandler } = require("../../middlewares/logging");
const logger = require("../../utils/logger");

/**
 * Book Controller - HTTP Request/Response Handling
 */
const getBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.debug(`Fetching book: ${id}`);
  const book = await BookUseCases.getBookById(id);

  res.status(200).json({
    success: true,
    data: book,
  });
});

const getAllBooks = asyncHandler(async (req, res) => {
  const result = await BookUseCases.getAllBooks(req.query);

  res.status(200).json({
    success: true,
    data: result.books,
    pagination: result.pagination,
  });
});

const searchBooks = asyncHandler(async (req, res) => {
  const result = await BookUseCases.searchBooks(req.query);

  res.status(200).json({
    success: true,
    data: result.books,
    pagination: result.pagination,
  });
});

const getPopularBooks = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const books = await BookUseCases.getPopularBooks(parseInt(limit));

  res.status(200).json({
    success: true,
    data: books,
  });
});

const getBooksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await BookUseCases.getBooksByCategory(
    category,
    parseInt(page),
    parseInt(limit),
  );

  res.status(200).json({
    success: true,
    data: result.books,
    pagination: result.pagination,
  });
});

const createBook = asyncHandler(async (req, res) => {
  logger.debug("Creating new book");
  const book = await BookUseCases.createBook(req.body);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
  });
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.debug(`Updating book: ${id}`);
  const book = await BookUseCases.updateBook(id, req.body);

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.debug(`Deleting book: ${id}`);
  await BookUseCases.deleteBook(id);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

module.exports = {
  getBook,
  getAllBooks,
  searchBooks,
  getPopularBooks,
  getBooksByCategory,
  createBook,
  updateBook,
  deleteBook,
};
