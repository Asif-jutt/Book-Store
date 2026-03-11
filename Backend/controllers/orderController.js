const Order = require("../models/Order");
const Book = require("../models/Book");
const Purchase = require("../models/Purchase");

// Create order (called after successful payment or free enrollment)
const createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get user's order history
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user._id };
    if (status) query.paymentStatus = status;

    const orders = await Order.find(query)
      .populate("book", "title image author category price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Calculate totals
    const totalSpent = await Order.aggregate([
      { $match: { user: req.user._id, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      totalSpent: totalSpent[0]?.total || 0,
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

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("book", "title image author category price description")
      .populate("user", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order by order number
const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate("book", "title image author category price")
      .populate("user", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    const query = {};
    if (status) query.paymentStatus = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate("book", "title price category")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Calculate stats
    const stats = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$amount" },
        },
      },
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      stats: {
        totalRevenue: stats[0]?.totalRevenue || 0,
        totalOrders: stats[0]?.totalOrders || 0,
        avgOrderValue: stats[0]?.avgOrderValue || 0,
        recentRevenue: recentRevenue[0]?.total || 0,
        recentOrders: recentRevenue[0]?.count || 0,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      },
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

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true },
    )
      .populate("book", "title")
      .populate("user", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If order is marked as paid, ensure purchase record exists
    if (paymentStatus === "paid") {
      const existingPurchase = await Purchase.findOne({
        user: order.user._id,
        book: order.book._id,
        paymentStatus: "completed",
      });

      if (!existingPurchase) {
        await Purchase.create({
          user: order.user._id,
          book: order.book._id,
          price: order.amount,
          currency: order.currency,
          paymentStatus: "completed",
          paymentMethod: order.paymentMethod,
          transactionId: order.paymentId,
          accessGrantedAt: new Date(),
        });

        // Update book student count
        await Book.findByIdAndUpdate(order.book._id, {
          $inc: { totalStudents: 1 },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order statistics for dashboard
const getOrderStats = async (req, res) => {
  try {
    // Total stats
    const totalStats = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Monthly revenue (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top selling books
    const topBooks = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: "$book",
          sales: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $project: {
          _id: 1,
          sales: 1,
          revenue: 1,
          title: { $arrayElemAt: ["$bookDetails.title", 0] },
          category: { $arrayElemAt: ["$bookDetails.category", 0] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalStats[0]?.totalRevenue || 0,
        totalOrders: totalStats[0]?.totalOrders || 0,
        monthlyRevenue,
        topBooks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
