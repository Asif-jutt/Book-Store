const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/create-session", protect, createCheckoutSession);
router.get("/verify/:sessionId", protect, verifyPayment);
router.get("/history", protect, getPaymentHistory);

module.exports = router;
