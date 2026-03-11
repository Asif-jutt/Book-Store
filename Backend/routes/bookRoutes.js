const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBook,
  getBookContent,
  createBook,
  updateBook,
  deleteBook,
  getAdminBooks,
} = require("../controllers/bookController");
const { protect, optionalAuth, admin } = require("../middleware/auth");
const { checkCourseAccess } = require("../middleware/courseAccess");

router.get("/", getBooks);
router.get("/admin/all", protect, admin, getAdminBooks);
router.get("/:id", optionalAuth, getBook);
router.get("/:id/content", protect, checkCourseAccess, getBookContent);
router.post("/", protect, admin, createBook);
router.put("/:id", protect, admin, updateBook);
router.delete("/:id", protect, admin, deleteBook);

module.exports = router;
