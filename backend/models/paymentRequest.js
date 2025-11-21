const mongoose = require("mongoose");

const paymentRequestSchema = new mongoose.Schema(
  {
    managementId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Management",
    },
    amount: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "pending"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentRequest", paymentRequestSchema);
