const mongoose = require('mongoose');

const plansModel = new mongoose.Schema({
    planType: {
        type: String,
        enum: ["fullday", "halfday"],
        required: true,
    },

    timing: {
        type: String,
        enum: ["morning", "evening", "fullday"],
        default: ""
    },

    morningTime: {
        type: String,
        default: ""
    },
    eveningTime: {
        type: String,
        default: ""
    },

    pass: [
        {
            passType: {
                name: {
                    type: String,
                    // required: true,
                    lowercase: true,
                    trim: true,
                    set: (v) => v.replace(/\s+/g, "")
                },
                price: {
                    type: Number,
                    // required: true,
                    min: 0,
                },
            },
        },
    ],

    discounts: [
        {
            duration: {
                type: String,
                enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            },
            discountPercent: {
                type: Number,
                min: 0,
                max: 100,
            },
        },
    ],
});

module.exports = mongoose.model('Plan', plansModel);
