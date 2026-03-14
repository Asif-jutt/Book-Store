const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide book title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please provide author name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide book description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide book price"],
      min: 0,
      default: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide book category"],
      enum: ["free", "paid", "premium"],
      default: "free",
    },
    // Book genre/subject
    genre: {
      type: String,
      enum: [
        "programming",
        "ai",
        "data-science",
        "business",
        "self-development",
        "fiction",
        "non-fiction",
        "science",
        "history",
        "other",
      ],
      default: "other",
    },
    image: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    // PDF file path (stored securely)
    pdfFile: {
      type: String,
      default: "",
    },
    // File metadata
    fileSize: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: "",
    },
    chapters: [
      {
        title: String,
        content: String,
        duration: Number,
        order: Number,
      },
    ],
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    language: {
      type: String,
      default: "English",
    },
    tags: [String],
    isbn: {
      type: String,
      default: "",
    },
    publisher: {
      type: String,
      default: "",
    },
    publicationYear: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

bookSchema.index({ title: "text", description: "text", author: "text" });
bookSchema.index({ genre: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ isPublished: 1, isFeatured: 1 });

module.exports = mongoose.model("Book", bookSchema);
