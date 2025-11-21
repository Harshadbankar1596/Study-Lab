const mongoose = require("mongoose");

const chargesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Registeration"],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Charges", chargesSchema);
