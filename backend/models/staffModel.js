const mongoose = require('mongoose');

const StaffModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        reqiured: true,
    }
})

module.exports = mongoose.model('Staff', StaffModel);