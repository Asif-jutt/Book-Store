const express = require("express");
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
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

module.exports = router;
