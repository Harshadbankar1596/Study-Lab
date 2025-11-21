const mongoose = require("mongoose");

const AddOnSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, { timestamps: true});

module.exports = mongoose.model("AddOnServices", AddOnSchema);