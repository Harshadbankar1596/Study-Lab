const mongoose = require('mongoose');
const gallerySchema = new mongoose.Schema({
    caption:{
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('Gallery', gallerySchema);
