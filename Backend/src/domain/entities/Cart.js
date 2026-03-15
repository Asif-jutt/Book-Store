const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        priceSnapshot: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Hook to calculate totals
cartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0,
  );
  this.tax = Math.round(this.subtotal * 0.1 * 100) / 100; // 10% tax
  this.total = this.subtotal + this.tax;
  next();
});

// Index for faster queries
cartSchema.index({ userId: 1 });
cartSchema.index({ "items.bookId": 1 });

module.exports = mongoose.model("Cart", cartSchema);
