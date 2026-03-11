const Purchase = require("../models/Purchase");
const Book = require("../models/Book");
const Order = require("../models/Order");

const purchaseFreeBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.category !== "free") {
      return res.status(400).json({
        success: false,
        message: "This book is not free. Please purchase it.",
      });
    }

    const existingPurchase = await Purchase.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You have already enrolled in this book",
      });
    }

    const purchase = await Purchase.create({
      user: req.user._id,
      book: bookId,
      price: 0,
      currency: "usd",
      paymentStatus: "completed",
      paymentMethod: "free",
      transactionId: `FREE-${Date.now()}`,
      accessGrantedAt: new Date(),
    });

    // Create order record for free enrollment
    await Order.create({
      user: req.user._id,
      book: bookId,
      amount: 0,
      currency: "usd",
      paymentStatus: "paid",
      paymentMethod: "free",
      paymentId: `FREE-${Date.now()}`,
      customerEmail: req.user.email,
      customerName: req.user.fullName,
      metadata: {
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCategory: book.category,
      },
    });

    await Book.findByIdAndUpdate(bookId, {
      $inc: { totalStudents: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in free course",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user._id,
      paymentStatus: "completed",
    })
      .populate(
        "book",
        "title image author description category price totalChapters totalDuration",
      )
      .sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkPurchaseStatus = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.category === "free") {
      const enrollment = await Purchase.findOne({
        user: req.user._id,
        book: bookId,
      });

      return res.status(200).json({
        success: true,
        hasAccess: true,
        isFree: true,
        isEnrolled: !!enrollment,
        book: book,
      });
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      book: bookId,
      paymentStatus: "completed",
    });

    res.status(200).json({
      success: true,
      hasAccess: !!purchase,
      isFree: false,
      isPurchased: !!purchase,
      purchase: purchase,
      book: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("book")
      .populate("user", "fullName email");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    if (
      purchase.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this purchase",
      });
    }

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.paymentStatus = status;

    const purchases = await Purchase.find(query)
      .populate("book", "title price category")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Purchase.countDocuments(query);

    const stats = await Purchase.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalPurchases: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: purchases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      stats: stats[0] || { totalRevenue: 0, totalPurchases: 0 },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  purchaseFreeBook,
  getUserPurchases,
  checkPurchaseStatus,
  getPurchaseById,
  getAllPurchases,
};
