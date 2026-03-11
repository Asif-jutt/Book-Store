const Book = require("../models/Book");
const Purchase = require("../models/Purchase");

const getBooks = async (req, res) => {
  try {
    const { category, search, level, page = 1, limit = 12 } = req.query;
    let query = { isPublished: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (level && level !== "all") {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const books = await Book.find(query)
      .select("-chapters -content")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "createdBy",
      "fullName profilePicture",
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    let hasAccess = false;
    let isPurchased = false;

    if (book.category === "free") {
      hasAccess = true;
    } else if (req.user) {
      if (req.user.role === "admin") {
        hasAccess = true;
      } else {
        const purchase = await Purchase.findOne({
          user: req.user._id,
          book: book._id,
          paymentStatus: "completed",
        });
        hasAccess = !!purchase;
        isPurchased = !!purchase;
      }
    }

    const bookData = book.toObject();

    if (!hasAccess) {
      delete bookData.chapters;
      delete bookData.content;
      bookData.chaptersPreview = book.chapters?.slice(0, 2).map((ch) => ({
        title: ch.title,
        duration: ch.duration,
        order: ch.order,
      }));
    }

    res.status(200).json({
      success: true,
      data: bookData,
      hasAccess,
      isPurchased,
      isFree: book.category === "free",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookContent = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: book._id,
        title: book.title,
        chapters: book.chapters,
        content: book.content,
        totalChapters: book.totalChapters,
        totalDuration: book.totalDuration,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createBook = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;

    if (req.body.chapters && req.body.chapters.length > 0) {
      req.body.totalChapters = req.body.chapters.length;
      req.body.totalDuration = req.body.chapters.reduce(
        (sum, ch) => sum + (ch.duration || 0),
        0,
      );
    }

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (req.body.chapters && req.body.chapters.length > 0) {
      req.body.totalChapters = req.body.chapters.length;
      req.body.totalDuration = req.body.chapters.reduce(
        (sum, ch) => sum + (ch.duration || 0),
        0,
      );
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const books = await Book.find()
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments();

    const stats = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStudents: { $sum: "$totalStudents" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBooks,
  getBook,
  getBookContent,
  createBook,
  updateBook,
  deleteBook,
  getAdminBooks,
};
