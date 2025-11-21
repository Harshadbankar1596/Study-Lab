const mongoose = require("mongoose");

const commisionModel = new mongoose.Schema(
  {
    managementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Management",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commissionForThisMonth: {
      amount: { type: String },
      month: { type: String },
      year: { type: String },
      paymentStatus: {
        type: String,
        enum: ["paid", "pending", "unpaid", "recieved"],
        default: "unpaid",
      },
    },
    commissionForNextMonth: {
      amount: { type: String },
      month: { type: String },
      year: { type: String },
      paymentStatus: {
        type: String,
        enum: ["paid", "pending", "unpaid", "recieved"],
        default: "unpaid",
      },
    },
    // totalCommission: {
    //   type: Number,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commision", commisionModel);
