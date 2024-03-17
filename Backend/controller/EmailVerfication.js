
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const OtpModal = require('../modal/OTP');
const UserModal=require('../modal/User');
const bcrypt = require('bcrypt');
class EmailVerification {
    static VerifyEmail = async (req, res) => {
        const data = req.body;
        const email = data.email;
        const isUserForgetDetail=data.userForgetUserNamePasword;
        console.log(email);
        try {
            const isEmailAlreadyExist=await UserModal.findOne({email:email});
            if(isEmailAlreadyExist!=null && !isUserForgetDetail){
                return res.status(200).json("Email Already Exist");
            }
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            console.log(otp);
            const OtpAlreadyExist = await OtpModal.findOne({ email: email });
            const hashedOtp = await bcrypt.hash(otp, 10);
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 10);
            if (OtpAlreadyExist != null) {
                await OtpAlreadyExist.deleteOne();
            }
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.Email_Username,
                    pass: process.env.Email_Password
                }
            });
            const mailOptions = {
                from: process.env.Email_Username,
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP for email verification is: ${otp}`
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                    return res.status(500).json('Error sending OTP via email');
                } else {
                    console.log('Email sent: ' + info.response);
                    const newOtp = OtpModal({
                        email: email,
                        otpValue: hashedOtp,
                        OtpExpiredAt: expirationTime
                    });
                    await newOtp.save();
                    return res.status(200).json('OTP sent successfully');
                }
            });

        } catch (err) {
            console.log(err);
            return res.status(403).json("Internal Server Error");
        }
    }

    static verfiyOTP = async (req, res) => {
        const data = req.body;
        const email = data.email;
        const otp = data.otp;
        console.log(email);
        try {
            const userWithOtp = await OtpModal.findOne({ email: email });
            if (userWithOtp != null) {
                const isOtpValid = await bcrypt.compare(otp, userWithOtp.otpValue);
                if (isOtpValid && userWithOtp.OtpExpiredAt > new Date()) {
                    await userWithOtp.deleteOne();
                    return res.status(200).json("Email verfied successfully");
                }
                return res.status(201).json("Either otp is invalid or it expires");
            } else {
                return res.statu(201).json("Enter correct email");
            }
        } catch (err) {
            console.log(err);
            return res.status(403).json("Error verifying otp");
        }
    }
}

module.exports = EmailVerification;