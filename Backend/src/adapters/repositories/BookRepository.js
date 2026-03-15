const Book = require("../../../models/Book");
const { cacheService } = require("../../../config/cache");
const logger = require("../../../utils/logger");

/**
 * Book Repository - Abstraction for data access
 * Implements caching and efficient queries
 */
class BookRepository {
  /**
   * Find book by ID with caching
   */
  async findById(bookId) {
    try {
      // Check cache first
      const cacheKey = `book:${bookId}`;
      let book = await cacheService.get(cacheKey);

      if (book) {
        logger.debug(`Cache hit for book ${bookId}`);
        return book;
      }

      // If not in cache, fetch from DB
      book = await Book.findById(bookId);

      if (book) {
        // Cache for 1 hour
        await cacheService.set(cacheKey, book, 3600);
      }

      return book;
    } catch (error) {
      logger.error(`Error finding book ${bookId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all books with pagination, filtering, and sorting
   */
  async getBooks(query) {
    try {
      const { page = 1, limit = 10, sort = "-createdAt", ...filters } = query;
      const skip = (page - 1) * limit;

      // Check cache for this specific query
      const cacheKey = `books:list:${JSON.stringify({ page, limit, sort, ...filters })}`;
      let result = await cacheService.get(cacheKey);

      if (result) {
        logger.debug(`Cache hit for books list query`);
        return result;
      }

      // Build filter object
      const filterObj = {};
      if (filters.category) filterObj.category = filters.category;
      if (filters.genre) filterObj.genre = filters.genre;
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        filterObj.price = {};
        if (filters.minPrice !== undefined)
          filterObj.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined)
          filterObj.price.$lte = filters.maxPrice;
      }

      // Get total count
      const total = await Book.countDocuments(filterObj);

      // Fetch books with sorting and pagination
      const books = await Book.find(filterObj)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      result = {
        books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };

      // Cache for 5 minutes
      await cacheService.set(cacheKey, result, 300);

      return result;
    } catch (error) {
      logger.error(`Error fetching books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search books with MongoDB text search and aggregation
   */
  async searchBooks(query) {
    try {
      const {
        q,
        category,
        genre,
        minPrice,
        minRating,
        page = 1,
        limit = 10,
      } = query;

      // Check cache
      const cacheKey = `books:search:${JSON.stringify({ q, category, genre, minPrice, minRating, page, limit })}`;
      let result = await cacheService.get(cacheKey);

      if (result) {
        logger.debug(`Cache hit for books search`);
        return result;
      }

      const skip = (page - 1) * limit;
      const matchStage = {};

      // Text search
      if (q) {
        matchStage.$text = { $search: q };
      }

      // Filters
      if (category) matchStage.category = category;
      if (genre) matchStage.genre = genre;
      if (minPrice !== undefined) matchStage.price = { $gte: minPrice };
      if (minRating !== undefined) matchStage.ratingAvg = { $gte: minRating };

      // Aggregation pipeline for complex query
      const totalResult = await Book.aggregate([
        { $match: matchStage },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $sort: { score: { $meta: "textScore" }, createdAt: -1 } },
              { $skip: skip },
              { $limit: parseInt(limit) },
            ],
          },
        },
      ]);

      const total = totalResult[0]?.metadata[0]?.total || 0;
      const books = totalResult[0]?.data || [];

      result = {
        books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };

      // Cache for 5 minutes
      await cacheService.set(cacheKey, result, 300);

      return result;
    } catch (error) {
      logger.error(`Error searching books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get trending/popular books
   */
  async getPopularBooks(limit = 10) {
    try {
      const cacheKey = "books:popular";
      let books = await cacheService.get(cacheKey);

      if (books) {
        logger.debug("Cache hit for popular books");
        return books;
      }

      books = await Book.aggregate([
        { $match: { status: "active" } },
        {
          $addFields: {
            popularity: {
              $add: [
                { $multiply: ["$totalStudents", 0.5] },
                { $multiply: ["$ratingAvg", 0.3] },
                { $multiply: ["$ratingCount", 0.2] },
              ],
            },
          },
        },
        { $sort: { popularity: -1 } },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            title: 1,
            author: 1,
            price: 1,
            image: 1,
            ratingAvg: 1,
            totalStudents: 1,
          },
        },
      ]);

      // Cache for 1 hour
      await cacheService.set(cacheKey, books, 3600);

      return books;
    } catch (error) {
      logger.error(`Error fetching popular books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create new book
   */
  async create(bookData) {
    try {
      const book = await Book.create(bookData);

      // Invalidate cache
      await cacheService.delete("books:popular");
      await cacheService.clear("books:list:*");

      return book;
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update book
   */
  async update(bookId, updateData) {
    try {
      const book = await Book.findByIdAndUpdate(bookId, updateData, {
        new: true,
        runValidators: true,
      });

      if (book) {
        // Invalidate relevant caches
        await cacheService.delete(`book:${bookId}`);
        await cacheService.delete("books:popular");
        await cacheService.clear("books:list:*");
      }

      return book;
    } catch (error) {
      logger.error(`Error updating book ${bookId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete book
   */
  async delete(bookId) {
    try {
      const result = await Book.findByIdAndDelete(bookId);

      if (result) {
        // Invalidate cache
        await cacheService.delete(`book:${bookId}`);
        await cacheService.delete("books:popular");
        await cacheService.clear("books:list:*");
      }

      return result;
    } catch (error) {
      logger.error(`Error deleting book ${bookId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new BookRepository();
