const mongoose = require('mongoose');

const TimeSlots = new mongoose.Schema({
    fromTime: {
        type: Date,
        required: true,
    },
    toTime: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model("Time", TimeSlots)