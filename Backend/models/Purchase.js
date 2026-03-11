const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "paypal", "free"],
      required: true,
    },
    transactionId: {
      type: String,
      default: "",
    },
    stripeSessionId: {
      type: String,
      default: "",
    },
    stripePaymentIntentId: {
      type: String,
      default: "",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    accessGrantedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    refundReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

purchaseSchema.index({ user: 1, book: 1 });
purchaseSchema.index({ stripeSessionId: 1 });
purchaseSchema.index({ transactionId: 1 });

purchaseSchema.statics.hasUserPurchased = async function (userId, bookId) {
  const purchase = await this.findOne({
    user: userId,
    book: bookId,
    paymentStatus: "completed",
  });
  return !!purchase;
};

module.exports = mongoose.model("Purchase", purchaseSchema);
