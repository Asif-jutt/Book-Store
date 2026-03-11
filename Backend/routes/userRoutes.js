const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  uploadProfilePicture,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUserById,
  getUserStats,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// User routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.post(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture,
);
router.delete("/account", protect, deleteAccount);

// Admin routes
router.get("/admin/all", protect, admin, getAllUsers);
router.get("/admin/stats", protect, admin, getUserStats);
router.get("/admin/:id", protect, admin, getUserById);
router.put("/admin/:id/role", protect, admin, updateUserRole);
router.delete("/admin/:id", protect, admin, deleteUserById);

module.exports = router;
