const mongoose = require("mongoose")

const logSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true 
    },

    Logs: [
        {
            Date: { type: String, required: true },
            PunchIn: {
                type: [String],
                default: []
            },
        }
    ]
})

logSchema.index({ User: 1 })

module.exports = mongoose.model("Logs", logSchema)