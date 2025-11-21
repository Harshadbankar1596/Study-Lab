
const mongoose = require('mongoose');

const seatModel = new mongoose.Schema({
    floor: {
        type: String,
        enum: ["1", "2"],
        default: "1",
        required: true,
    },
    row: {
        type: String,
        required: true,
        uppercase: true
    },
    seatNumber: {
        type: String,
        // required: true,
    },
    // status: {
    //     type: String,
    //     enum: ["booked", "expired", "pending", "blocked"],  
    //     default: "pending",
    //     lowercase: true
    // },
    bookedForEvening:{
        type : Boolean,
        default : null
    },
     bookedForMorning:{
        type : Boolean,
        default : null
    },
     bookedForFullDay:{
        type : Boolean,
        default : null
    }
})

module.exports = mongoose.model('Seat', seatModel);