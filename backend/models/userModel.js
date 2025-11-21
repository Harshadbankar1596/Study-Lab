const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      ref: "Bookings",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    regiterationAmount: {
      type: String,
      // required : true,
      default: "0",
    },
    paymentStatus: {
      type: String,
      // required : true
      default: "Pending",
    },
    dob: {
      type: String,
      required: true,
      trim: true,
    },
    parentsContact: {
      type: String,
      required: true,
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      // required : true,
    },
    permenantAdd: {
      type: String,
      required: true,
    },
    currentAddress: {
      type: String,
      required: true,
    },
    classStd: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: String,
      // required: true,
    },
    addedBy: {
      type: String,
      enum: ["Student", "Management"],
      default: "Student",
    },
    managementId :{
      type : mongoose.Schema.Types.ObjectId,
      default : null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
