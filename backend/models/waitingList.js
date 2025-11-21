const mongoose = require("mongoose");

const waitingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Seat",
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Bookings",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waiting", waitingSchema);
