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
const {
  uploadBook,
  handleUploadError,
} = require("../middleware/uploadMiddleware");

router.get("/", getBooks);
router.get("/admin/all", protect, admin, getAdminBooks);
router.get("/:id", optionalAuth, getBook);
router.get("/:id/content", protect, checkCourseAccess, getBookContent);
router.post(
  "/",
  protect,
  admin,
  uploadBook.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  handleUploadError,
  createBook,
);
router.put(
  "/:id",
  protect,
  admin,
  uploadBook.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  handleUploadError,
  updateBook,
);
router.delete("/:id", protect, admin, deleteBook);

module.exports = router;
