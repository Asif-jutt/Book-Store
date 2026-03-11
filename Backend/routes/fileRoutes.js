const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getMyFiles,
  getFile,
  deleteFile,
} = require("../controllers/fileController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getMyFiles);
router.get("/:id", protect, getFile);
router.delete("/:id", protect, deleteFile);

module.exports = router;
