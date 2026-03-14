const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = ["uploads/pdfs", "uploads/covers", "uploads/temp"];
uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Generate secure filename with random hash
const generateSecureFilename = (originalname) => {
  const ext = path.extname(originalname);
  const hash = crypto.randomBytes(32).toString("hex");
  const timestamp = Date.now();
  return `${timestamp}-${hash}${ext}`;
};

// PDF storage configuration
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads/pdfs"));
  },
  filename: (req, file, cb) => {
    cb(null, generateSecureFilename(file.originalname));
  },
});

// Cover image storage configuration
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads/covers"));
  },
  filename: (req, file, cb) => {
    cb(null, generateSecureFilename(file.originalname));
  },
});

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed"), false);
  }
};

// PDF upload middleware (max 100MB)
const uploadPDF = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: pdfFilter,
});

// Cover image upload middleware (max 5MB)
const uploadCover = multer({
  storage: coverStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFilter,
});

// Combined upload for book (PDF + cover)
const uploadBook = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "pdf") {
        cb(null, path.join(__dirname, "..", "uploads/pdfs"));
      } else if (file.fieldname === "cover") {
        cb(null, path.join(__dirname, "..", "uploads/covers"));
      } else {
        cb(null, path.join(__dirname, "..", "uploads/temp"));
      }
    },
    filename: (req, file, cb) => {
      cb(null, generateSecureFilename(file.originalname));
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for PDFs
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "pdf") {
      return pdfFilter(req, file, cb);
    } else if (file.fieldname === "cover") {
      return imageFilter(req, file, cb);
    }
    cb(new Error("Unexpected field"), false);
  },
});

// Error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// Delete file utility
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};

module.exports = {
  uploadPDF,
  uploadCover,
  uploadBook,
  handleUploadError,
  deleteFile,
  generateSecureFilename,
};
