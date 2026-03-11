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
    image: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Book", bookSchema);
