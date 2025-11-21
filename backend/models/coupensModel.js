const mongoose = require('mongoose');

const coupensModel = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('Coupens', coupensModel);