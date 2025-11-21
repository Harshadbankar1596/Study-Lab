const monogoose = require('mongoose');
const updatesSchema = new monogoose.Schema({
    title: {   
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = monogoose.model('Updates', updatesSchema);
