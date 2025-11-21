const mongoose = require('mongoose');

const AllocatedCoupenSchema = new mongoose.Schema({
    coupenId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Coupens"
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    ],
    validTill: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "expired", "allocated", "redeemed"],
        default: "pending"
    }
}, { timestamps: true })

module.exports = mongoose.model("Allocated", AllocatedCoupenSchema);