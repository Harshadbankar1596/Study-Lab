const mongoose = require("mongoose");

const bookingsModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatNo: {
      type: String,
      required: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Seat",
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    timings: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    addOnServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      required: false,
    },
    addOnServiceQuantity: {
      type: Number,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    discountedAmount: {
      type: Number,
      // required: true
      default: 0,
    },
    status: {
      type: String,
      enum: ["booked", "expired", "pending"],
      default: "pending",
    },
    adharF: {
      type: String,
      // required : true,
    },
    adharB: {
      type: String,
      // required : true
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    isPreBooked: {
      type: Boolean,
      default: false,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_order_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "failed"],
    },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingsModel);
