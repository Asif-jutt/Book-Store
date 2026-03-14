const Book = require("../models/Book");
const Purchase = require("../models/Purchase");
const Order = require("../models/Order");

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
    let orderStatus = null;

    if (book.category === "free") {
      hasAccess = true;
    } else if (req.user) {
      if (req.user.role === "admin") {
        hasAccess = true;
      } else {
        // Check for completed purchase
        const purchase = await Purchase.findOne({
          user: req.user._id,
          book: book._id,
          paymentStatus: "completed",
        });
        if (purchase) {
          hasAccess = true;
          isPurchased = true;
        } else {
          // Check for an order (pending or approved)
          const order = await Order.findOne({
            user: req.user._id,
            book: book._id,
            $or: [{ approvalStatus: "approved" }, { paymentStatus: "paid" }],
          }).sort({ createdAt: -1 });

          if (order) {
            isPurchased = true;
            orderStatus = order.approvalStatus || order.paymentStatus;
            hasAccess = true;
          }
        }
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
      orderStatus,
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
    const bookData = { ...req.body, createdBy: req.user._id };

    // Parse chapters if sent as JSON string (FormData sends strings)
    if (typeof bookData.chapters === "string") {
      try {
        bookData.chapters = JSON.parse(bookData.chapters);
      } catch {
        bookData.chapters = [];
      }
    }

    // Parse tags if sent as JSON string
    if (typeof bookData.tags === "string") {
      try {
        bookData.tags = JSON.parse(bookData.tags);
      } catch {
        bookData.tags = bookData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    // Parse boolean
    if (typeof bookData.isPublished === "string") {
      bookData.isPublished = bookData.isPublished === "true";
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.pdf && req.files.pdf[0]) {
        bookData.pdfFile = `uploads/pdfs/${req.files.pdf[0].filename}`;
        bookData.fileSize = req.files.pdf[0].size;
      }
      if (req.files.cover && req.files.cover[0]) {
        bookData.image = `uploads/covers/${req.files.cover[0].filename}`;
      }
    }

    if (bookData.chapters && bookData.chapters.length > 0) {
      bookData.totalChapters = bookData.chapters.length;
      bookData.totalDuration = bookData.chapters.reduce(
        (sum, ch) => sum + (ch.duration || 0),
        0,
      );
    }

    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      const fs = require("fs");
      Object.values(req.files)
        .flat()
        .forEach((f) => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
    }
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

    const updateData = { ...req.body };

    // Parse chapters if sent as JSON string
    if (typeof updateData.chapters === "string") {
      try {
        updateData.chapters = JSON.parse(updateData.chapters);
      } catch {
        delete updateData.chapters;
      }
    }

    // Parse tags if sent as JSON string
    if (typeof updateData.tags === "string") {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch {
        updateData.tags = updateData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    // Parse boolean
    if (typeof updateData.isPublished === "string") {
      updateData.isPublished = updateData.isPublished === "true";
    }

    // Handle uploaded files
    if (req.files) {
      const fs = require("fs");
      const path = require("path");

      if (req.files.pdf && req.files.pdf[0]) {
        // Delete old PDF if exists
        if (book.pdfFile) {
          const oldPath = path.join(__dirname, "..", book.pdfFile);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updateData.pdfFile = `uploads/pdfs/${req.files.pdf[0].filename}`;
        updateData.fileSize = req.files.pdf[0].size;
      }
      if (req.files.cover && req.files.cover[0]) {
        // Delete old cover if exists and is a local file
        if (book.image && book.image.startsWith("uploads/")) {
          const oldPath = path.join(__dirname, "..", book.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updateData.image = `uploads/covers/${req.files.cover[0].filename}`;
      }
    }

    if (updateData.chapters && updateData.chapters.length > 0) {
      updateData.totalChapters = updateData.chapters.length;
      updateData.totalDuration = updateData.chapters.reduce(
        (sum, ch) => sum + (ch.duration || 0),
        0,
      );
    }

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
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
