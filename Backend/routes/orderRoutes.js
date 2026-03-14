const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

// User routes
router.get("/my-orders", protect, getMyOrders);
router.get("/order/:id", protect, getOrderById);
router.get("/number/:orderNumber", protect, getOrderByNumber);

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);
router.get("/admin/stats", protect, admin, getOrderStats);
router.put("/admin/:id/status", protect, admin, updateOrderStatus);

// Admin approval routes
router.get("/admin/pending-count", protect, admin, getPendingOrdersCount);
router.get("/admin/by-approval", protect, admin, getOrdersByApprovalStatus);
router.put("/admin/:id/approve", protect, admin, approveOrder);
router.put("/admin/:id/reject", protect, admin, rejectOrder);
router.put("/admin/:id/complete", protect, admin, completeOrder);

module.exports = router;
