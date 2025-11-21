const mongoose = require('mongoose');

const RedeemedSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    coupenId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Redeemed", RedeemedSchema);