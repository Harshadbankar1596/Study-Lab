const mongoose = require('mongoose'); 

const Otp = new mongoose.Schema({
    contact:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        index: { expires: 300 }
    }
})

module.exports = mongoose.model('Otp', Otp)
