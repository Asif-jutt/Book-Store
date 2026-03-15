const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating"],
    },
    comment: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to prevent duplicate reviews
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });
reviewSchema.index({ bookId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
