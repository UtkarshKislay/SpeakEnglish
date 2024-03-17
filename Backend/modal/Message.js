const mongoose =require('mongoose');

const messageSchema=new mongoose.Schema({
    uniqueId:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    senderAdd:{
       type:String,
       required:true,
    },
    message:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date,
        required:true
    }

});

module.exports=mongoose.model("Message",messageSchema);