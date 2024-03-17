const express=require('express');
const router=express.Router();

const UserConroller=require('../controller/User');
const EmailVerification=require('../controller/EmailVerfication');
const GoogleAu=require('../controller/loginWithPassport');



router.get("/google",GoogleAu.GoogleAuth);
router.get("/google/callback", GoogleAu.GoogleCallback);
router.get("/google/logout", GoogleAu.Logout);
router.post('/user/login',UserConroller.Login);
router.post('/user/register',UserConroller.Register);
router.post('/user/registration/generate-otp',EmailVerification.VerifyEmail)
router.post('/user/registration/verify-otp',EmailVerification.verfiyOTP);

module.exports=router;