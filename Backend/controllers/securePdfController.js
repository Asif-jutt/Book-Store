const Book = require("../models/Book");
const Purchase = require("../models/Purchase");
const Order = require("../models/Order");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Temporary access tokens for PDF viewing (in-memory store, use Redis in production)
const accessTokens = new Map();

// Token expiry time (15 minutes)
const TOKEN_EXPIRY = 15 * 60 * 1000;

const resolvePdfPath = (storedPath) => {
  if (!storedPath) {
    return null;
  }

  const normalizedPath = storedPath.replace(/\\/g, "/").replace(/^\/+/, "");
  const fileName = path.basename(normalizedPath);
  const candidates = [
    storedPath,
    path.resolve(__dirname, "..", normalizedPath),
    path.resolve(__dirname, "..", "uploads", normalizedPath),
    path.resolve(__dirname, "..", "uploads", fileName),
    path.resolve(__dirname, "..", "uploads", "pdfs", fileName),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

// Clean expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of accessTokens.entries()) {
    if (now > data.expiresAt) {
      accessTokens.delete(token);
    }
  }
}, 60 * 1000); // Clean every minute

// Generate secure access token for PDF viewing
const generatePdfAccessToken = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const hasAccess =
      book.category === "free" ||
      req.user.role === "admin" ||
      !!(await Purchase.findOne({
        user: userId,
        book: bookId,
        paymentStatus: "completed",
      })) ||
      !!(await Order.findOne({
        user: userId,
        book: bookId,
        $or: [{ approvalStatus: "approved" }, { paymentStatus: "paid" }],
      }).sort({ createdAt: -1 }));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this book",
      });
    }

    // Check if book has PDF file
    if (!book.pdfFile) {
      return res.status(404).json({
        success: false,
        message: "PDF not available for this book",
      });
    }

    const resolvedPdfPath = resolvePdfPath(book.pdfFile);
    if (!resolvedPdfPath) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found on server",
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + TOKEN_EXPIRY;

    accessTokens.set(token, {
      userId: userId.toString(),
      bookId: bookId,
      pdfFile: book.pdfFile,
      pdfPath: resolvedPdfPath,
      expiresAt,
      createdAt: Date.now(),
    });

    res.status(200).json({
      success: true,
      accessToken: token,
      expiresIn: TOKEN_EXPIRY / 1000, // seconds
      bookTitle: book.title,
      totalPages: book.totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stream PDF file securely
const streamPdf = async (req, res) => {
  try {
    const { token } = req.params;

    // Validate token
    const tokenData = accessTokens.get(token);
    if (!tokenData) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    // Check expiry
    if (Date.now() > tokenData.expiresAt) {
      accessTokens.delete(token);
      return res.status(403).json({
        success: false,
        message: "Access token expired",
      });
    }

    const pdfPath = tokenData.pdfPath || resolvePdfPath(tokenData.pdfFile);

    // Check if file exists
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    // Get file stats
    const stat = fs.statSync(pdfPath);
    const fileSize = stat.size;

    // Set headers to prevent downloading
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline"); // Display in browser, not download
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Accept-Ranges", "bytes");
    // Prevent embedding in other sites
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");

    let stream;
    const range = req.headers.range;

    if (range) {
      const [startValue, endValue] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startValue, 10);
      const end = endValue ? parseInt(endValue, 10) : fileSize - 1;

      if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
        return res.status(416).json({
          success: false,
          message: "Invalid range request",
        });
      }

      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Content-Length", end - start + 1);
      stream = fs.createReadStream(pdfPath, { start, end });
    } else {
      res.setHeader("Content-Length", fileSize);
      stream = fs.createReadStream(pdfPath);
    }

    stream.pipe(res);

    // Update last accessed time
    await Purchase.findOneAndUpdate(
      { user: tokenData.userId, book: tokenData.bookId },
      { lastAccessed: new Date() },
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get specific page of PDF (for lazy loading)
const getPdfPage = async (req, res) => {
  try {
    const { token, page } = req.params;
    const pageNum = parseInt(page);

    // Validate token
    const tokenData = accessTokens.get(token);
    if (!tokenData) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    // Check expiry
    if (Date.now() > tokenData.expiresAt) {
      accessTokens.delete(token);
      return res.status(403).json({
        success: false,
        message: "Access token expired",
      });
    }

    // This endpoint returns the same PDF but client-side reader handles pagination
    // In a more advanced setup, you could split PDFs into individual pages

    res.status(200).json({
      success: true,
      message: "Use the stream endpoint to access the full PDF",
      streamUrl: `/api/secure-pdf/stream/${token}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Invalidate access token (for logout or session end)
const invalidateToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (accessTokens.has(token)) {
      accessTokens.delete(token);
    }

    res.status(200).json({
      success: true,
      message: "Token invalidated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Upload PDF for a book
const uploadBookPdf = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      // Delete uploaded file if book not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Delete old PDF if exists
    if (book.pdfFile) {
      const oldPath = path.join(__dirname, "..", book.pdfFile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update book with new PDF
    book.pdfFile = `uploads/pdfs/${req.file.filename}`;
    book.fileSize = req.file.size;

    await book.save();

    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      data: {
        pdfFile: book.pdfFile,
        fileSize: book.fileSize,
      },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user has access to a book
const checkBookAccess = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId).select("category");
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.category === "free" || req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        hasAccess: true,
      });
    }

    // Check purchase or approved order
    const [purchase, paidOrder] = await Promise.all([
      Purchase.findOne({
        user: userId,
        book: bookId,
        paymentStatus: "completed",
      }),
      Order.findOne({
        user: userId,
        book: bookId,
        $or: [{ approvalStatus: "approved" }, { paymentStatus: "paid" }],
      }),
    ]);

    const hasAccess = !!(purchase || paidOrder);

    res.status(200).json({
      success: true,
      hasAccess,
      purchaseDate: purchase?.accessGrantedAt || paidOrder?.approvedAt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generatePdfAccessToken,
  streamPdf,
  getPdfPage,
  invalidateToken,
  uploadBookPdf,
  checkBookAccess,
};
