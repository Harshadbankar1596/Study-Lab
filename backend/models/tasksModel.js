const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    status:{
        type : String,
        enum : ['pending', 'done', 'undone'],
        default : 'pending'
    },
    staff:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Staff',
        required : true
    },
}, { timestamps : true})

module.exports = mongoose.model('Task', taskSchema);