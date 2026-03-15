const BookRepository = require("../../adapters/repositories/BookRepository");
const { NotFoundError, ValidationError } = require("../../utils/errors");
const logger = require("../../utils/logger");

/**
 * Book Use Cases - Application Business Logic
 */
class BookUseCases {
  /**
   * Get single book by ID
   */
  async getBookById(bookId) {
    try {
      const book = await BookRepository.findById(bookId);

      if (!book) {
        throw new NotFoundError("Book");
      }

      return book;
    } catch (error) {
      logger.error(`Error getting book by ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all books with filters and pagination
   */
  async getAllBooks(query) {
    try {
      // Validate pagination parameters
      if (query.page && query.page < 1) {
        throw new ValidationError("Invalid page number", [
          { field: "page", message: "Page must be >= 1" },
        ]);
      }

      if (query.limit && (query.limit < 1 || query.limit > 100)) {
        throw new ValidationError("Invalid limit", [
          { field: "limit", message: "Limit must be between 1 and 100" },
        ]);
      }

      return await BookRepository.getBooks(query);
    } catch (error) {
      logger.error(`Error getting all books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search books
   */
  async searchBooks(query) {
    try {
      if (!query.q && !query.category && !query.genre) {
        throw new ValidationError("Invalid search parameters", [
          {
            field: "search",
            message:
              "Provide at least one search parameter (q, category, or genre)",
          },
        ]);
      }

      return await BookRepository.searchBooks(query);
    } catch (error) {
      logger.error(`Error searching books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get popular/trending books
   */
  async getPopularBooks(limit = 10) {
    try {
      if (limit < 1 || limit > 100) {
        throw new ValidationError("Invalid limit", [
          { field: "limit", message: "Limit must be between 1 and 100" },
        ]);
      }

      return await BookRepository.getPopularBooks(limit);
    } catch (error) {
      logger.error(`Error getting popular books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create new book (admin only)
   */
  async createBook(bookData) {
    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "author",
        "description",
        "price",
        "category",
      ];
      const missingFields = requiredFields.filter((field) => !bookData[field]);

      if (missingFields.length > 0) {
        throw new ValidationError("Missing required fields", [
          ...missingFields.map((field) => ({
            field,
            message: `${field} is required`,
          })),
        ]);
      }

      return await BookRepository.create(bookData);
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update book (admin only)
   */
  async updateBook(bookId, updateData) {
    try {
      // Ensure book exists
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new NotFoundError("Book");
      }

      return await BookRepository.update(bookId, updateData);
    } catch (error) {
      logger.error(`Error updating book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete book (admin only)
   */
  async deleteBook(bookId) {
    try {
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new NotFoundError("Book");
      }

      return await BookRepository.delete(bookId);
    } catch (error) {
      logger.error(`Error deleting book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get book by category with pagination
   */
  async getBooksByCategory(category, page = 1, limit = 10) {
    try {
      return await BookRepository.getBooks({
        category,
        page,
        limit,
      });
    } catch (error) {
      logger.error(`Error getting books by category: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new BookUseCases();
