const express = require("express");
const router = express.Router();
const {
  generatePdfAccessToken,
  streamPdf,
  getPdfPage,
  invalidateToken,
  uploadBookPdf,
  checkBookAccess,
} = require("../controllers/securePdfController");
const { protect, admin } = require("../middleware/auth");
const {
  uploadPDF,
  handleUploadError,
} = require("../middleware/uploadMiddleware");

// User routes - require authentication
router.get("/access/:bookId", protect, generatePdfAccessToken);
router.get("/check-access/:bookId", protect, checkBookAccess);
router.delete("/invalidate/:token", protect, invalidateToken);

// Public streaming route (but requires valid token)
router.get("/stream/:token", streamPdf);
router.get("/page/:token/:page", getPdfPage);

// Admin routes
router.post(
  "/upload/:bookId",
  protect,
  admin,
  uploadPDF.single("pdf"),
  handleUploadError,
  uploadBookPdf,
);

module.exports = router;
