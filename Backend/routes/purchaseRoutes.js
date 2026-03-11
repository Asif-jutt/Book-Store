const express = require("express");
const router = express.Router();
const {
  purchaseFreeBook,
  getUserPurchases,
  checkPurchaseStatus,
  getPurchaseById,
  getAllPurchases,
} = require("../controllers/purchaseController");
const { protect, admin } = require("../middleware/auth");

router.post("/enroll", protect, purchaseFreeBook);
router.get("/my-purchases", protect, getUserPurchases);
router.get("/check/:bookId", protect, checkPurchaseStatus);
router.get("/admin/all", protect, admin, getAllPurchases);
router.get("/:id", protect, getPurchaseById);

module.exports = router;
