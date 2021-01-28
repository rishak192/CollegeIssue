const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuesAnsSchema = new Schema({

    Question:{
        type:String,
        required:true
    },
    UploaderID:{
        type:String,
        required:true
    },
    UploaderName:{
        type:String,
        required:true
    },
    DateTime:{
        type:Date,
        default:Date.now()
    },
    Answers:{
        type:Array,
    },
    Comments:{
        type:Array
    }
})

module.exports =  mongoose.model('QuesAns', QuesAnsSchema);