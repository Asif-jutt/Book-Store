const Purchase = require("../models/Purchase");
const Book = require("../models/Book");

const checkCourseAccess = async (req, res, next) => {
  try {
    const bookId = req.params.bookId || req.params.id;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.category === "free") {
      req.book = book;
      req.hasAccess = true;
      return next();
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this course",
      });
    }

    if (req.user.role === "admin") {
      req.book = book;
      req.hasAccess = true;
      return next();
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      book: bookId,
      paymentStatus: "completed",
    });

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: "Please purchase this course to access it",
        requiresPurchase: true,
        book: {
          _id: book._id,
          title: book.title,
          price: book.price,
          category: book.category,
        },
      });
    }

    req.book = book;
    req.purchase = purchase;
    req.hasAccess = true;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const optionalCourseAccess = async (req, res, next) => {
  try {
    const bookId = req.params.bookId || req.params.id;

    if (!bookId) {
      return next();
    }

    const book = await Book.findById(bookId);
    if (!book) {
      req.hasAccess = false;
      return next();
    }

    if (book.category === "free") {
      req.book = book;
      req.hasAccess = true;
      return next();
    }

    if (!req.user) {
      req.book = book;
      req.hasAccess = false;
      return next();
    }

    if (req.user.role === "admin") {
      req.book = book;
      req.hasAccess = true;
      return next();
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      book: bookId,
      paymentStatus: "completed",
    });

    req.book = book;
    req.purchase = purchase;
    req.hasAccess = !!purchase;
    next();
  } catch (error) {
    req.hasAccess = false;
    next();
  }
};

module.exports = { checkCourseAccess, optionalCourseAccess };
