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

// Admin: Get orders by approval status
const getOrdersByApprovalStatus = async (req, res) => {
  try {
    const { status = "pending", page = 1, limit = 20 } = req.query;

    const validStatuses = ["pending", "approved", "rejected", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const query = { approvalStatus: status };

    const orders = await Order.find(query)
      .populate("book", "title price category image author")
      .populate("user", "fullName email")
      .populate("approvedBy", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Get counts for all statuses
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$approvalStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
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

// Admin: Approve order
const approveOrder = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("book", "title")
      .populate("user", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only pending or paid orders can be approved
    if (order.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be approved. Current status: ${order.approvalStatus}`,
      });
    }

    // Check if payment is completed
    if (order.paymentStatus !== "paid" && order.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot approve order without completed payment",
      });
    }

    // Update order approval status
    order.approvalStatus = "approved";
    order.approvedBy = req.user._id;
    order.approvedAt = new Date();
    if (adminNotes) order.adminNotes = adminNotes;

    await order.save();

    // Create purchase record to grant access
    const existingPurchase = await Purchase.findOne({
      user: order.user._id,
      book: order.book._id,
    });

    if (!existingPurchase) {
      await Purchase.create({
        user: order.user._id,
        book: order.book._id,
        price: order.amount,
        currency: order.currency,
        paymentStatus: "completed",
        paymentMethod: order.paymentMethod,
        transactionId: order.paymentId || order.orderNumber,
        accessGrantedAt: new Date(),
      });

      // Update book student count
      await Book.findByIdAndUpdate(order.book._id, {
        $inc: { totalStudents: 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: "Order approved successfully. User now has access to the book.",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Reject order
const rejectOrder = async (req, res) => {
  try {
    const { rejectionReason, adminNotes } = req.body;
    const orderId = req.params.id;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const order = await Order.findById(orderId)
      .populate("book", "title")
      .populate("user", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only pending orders can be rejected
    if (order.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be rejected. Current status: ${order.approvalStatus}`,
      });
    }

    // Update order
    order.approvalStatus = "rejected";
    order.approvedBy = req.user._id;
    order.approvedAt = new Date();
    order.rejectionReason = rejectionReason;
    if (adminNotes) order.adminNotes = adminNotes;

    await order.save();

    // TODO: Initiate refund if payment was made
    // This would integrate with Stripe refunds

    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Mark order as completed (after user has fully accessed content)
const completeOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only approved orders can be completed
    if (order.approvalStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be completed. Current status: ${order.approvalStatus}`,
      });
    }

    order.approvalStatus = "completed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as completed",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get pending orders count (for admin dashboard notification)
const getPendingOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ approvalStatus: "pending" });

    res.status(200).json({
      success: true,
      pendingCount: count,
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
  getOrdersByApprovalStatus,
  approveOrder,
  rejectOrder,
  completeOrder,
  getPendingOrdersCount,
};
