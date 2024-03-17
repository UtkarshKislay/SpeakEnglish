const mongoose=require('mongoose');

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otpValue:{
        type:String,
        required:true,
        trim:true,
    },
    OtpExpiredAt:{
        type:Date,
        required:true
    }
});

module.exports=mongoose.model("Otp",OTPSchema);