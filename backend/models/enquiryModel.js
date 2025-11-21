const mongoose = require('mongoose');
const enquiryModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    }
}, { timestamps: true }
)
module.exports = mongoose.model("Enquiry", enquiryModel);