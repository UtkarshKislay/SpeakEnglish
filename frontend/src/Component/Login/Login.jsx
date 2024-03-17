import React, { useEffect } from 'react'
import axios from 'axios';
import googleLoginButton from "./web_neutral_rd_ctn.svg";
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveUserInfo } from '../../Redux/action';
import { useNavigate } from 'react-router-dom';
import { Blocks } from 'react-loader-spinner';
import './Login.css';
import Navbar from '../Navbar/Navbar';
const BASE_URL = 'http://localhost:5000/user';



const Login = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [userInfo, setUserInfo] = useState({
      email: '',
      userName: '',
      password: ''
   });
   const [userForgetUserNamePasword, setUserForgetUserNamePasword] = useState(false);
   const [otpValue, setOtpValue] = useState();
   const [login, setLogin] = useState(1);
   const [otpSent, setOtpSent] = useState(0);
   const [isRegistered, setIsRegistered] = useState(0);
   const [forgetPassword,setForgetPassword]=useState(false);
   const [generatingOtp,setGeneratingOtp]=useState(0);

   const [errorMessage, setErrorMessage] = useState({
      userNameAlreadyExist: '',
      emailAlreadyExist: '',
      passwordNotMatched: '',
      userNameNotExist: ''
   });

   useEffect(() => {
      const reset = () => {
         setOtpValue(null);

         //Changed temporarily
         // setLogin(1);
         setOtpSent(0);
      }
      reset();
   }, [userInfo.email]);


   const handleLogin = async () => {
      try {
         const res = await axios(`${BASE_URL}/login`, {
            method: 'post',
            data: {
               userName: userInfo.userName,
               password: userInfo.password
            }
         });

         const message = res.data.message;
         if (message === 'Login Successfull') {
            const user = res.data.user;
            console.log(user);
            console.log(user.userEmail, " ", user.userName);
            dispatch(saveUserInfo(user));
            navigate('/Main');
         } else if (message === 'Password not matched') {

         } else if (message === "UserName not exist") {

         } else {
            //server error
         }
      } catch (err) {
         console.log("error occured in Login: ", err);
      }


   }
   const handleRegisteration = async () => {
      try {
         console.log(userInfo);
         const res = await axios(`${BASE_URL}/register`, {
            method: 'post',
            data: {
               ...userInfo,
               userForgetUserNamePasword: userForgetUserNamePasword
            },
         });
         const message = res.data;
         if (message === 'New user save Successfully') {
            setIsRegistered(1);
         } else if (message === "Email Already Exist") {

         } else if (message == "Username Already Exist") {

         } else {
            //server error
         }
      } catch (err) {
         console.log("Error occured in Registration: ", err);
      }
   }

   const handleGenerateOtp = async () => {
      try {
         setGeneratingOtp(1);
         const res = await axios(`${BASE_URL}/registration/generate-otp`, {
            method: 'post',
            data: {
               email: userInfo.email,
               userForgetUserNamePasword: userForgetUserNamePasword
            }
         });
         if (res.data == "Email Already Exist") {
            setOtpSent(3);
            setGeneratingOtp(0);
         } else if (res.data === 'OTP sent successfully') {
            setOtpSent(1);
            setGeneratingOtp(0);
         }

      } catch (err) {
         setGeneratingOtp(0);
         console.log(err);
      }
   }

   const handleVerifyOTP = async () => {
      try {
         console.log("verifyOtp", otpValue);
         console.log("email: ", userInfo.email);
         const res = await axios(`${BASE_URL}/registration/verify-otp`, {
            method: 'Post',
            data: {
               email: userInfo.email,
               otp: otpValue
            }
         });
         console.log(res.data);
         if (res.data === 'Email verfied successfully') {
            setOtpSent(2);
         }

      } catch (err) {
         console.log(err);
      }
   }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserInfo(prev => ({
         ...prev,
         [name]: value
      }))
   }

   const handleFormSubmit = (e) => {
      e.preventDefault();
      if (login) {
         handleLogin();
      } else {
         handleRegisteration();
      }
   }

   const handleGoogleButtonClick=async()=>{
      try{
         const res=await axios.get("http://localhost:5000/google");
         console.log(res);



      }catch(err){
         console.log("google login button error: ",err);
      }
   }



   return (
      <div className='loginPage'>
         <div className="userRegistration">
            <div className="LoginPageTitle">
               {login ? <p>Login</p> : <p>Registration</p>}
            </div>

            <div className="oauth2">
              <img onClick={handleGoogleButtonClick} className='googleBtn' src={googleLoginButton} alt="" />
              <div className="others">OR</div>
            </div>

            {!login ? (
               <div className="email">
                  <input className='inputField' type="email" placeholder='Email' value={userInfo.email} onChange={handleChange} name='email' />
                  {otpSent === 0 ? (
                     <div className='getOtpAndGenearte'>
                        {generatingOtp?<div className='loaderForOtp'>
                           <Blocks
                              height="40"
                              width="40"
                              color="#4fa94d"
                              ariaLabel="blocks-loading"
                              wrapperStyle={{}}
                              wrapperClass="blocks-wrapper"
                              visible={true}
                              />
                        </div>:null}
                        <button className='buttonField' disabled={generatingOtp} onClick={handleGenerateOtp}>
                           Get OTP
                        </button>
                     </div>
                  ) : otpSent == 1 ? (
                     <div>
                        <input className='inputFieldOTP' placeholder='Enter OTP' value={otpValue} onChange={(e) => setOtpValue(e.target.value)} name='otp' />
                        <button className='buttonField' onClick={handleVerifyOTP}>
                           Verify OTP
                        </button>
                     </div>
                  ) : otpSent == 2 ? (
                     <div >
                        <p className='SuccessMessage'>
                           Email verified!
                        </p>
                     </div>
                  ) : otpSent == 3 ? (
                     <div>
                        <p className='FailureMessage'>Email Already Exist</p>
                        <p className='LinkMessage' onClick={() => {
                           setUserForgetUserNamePasword(true);
                           setOtpSent(0)
                        }}>Forget UserName & Password?</p>
                     </div>
                  ) : null}
               </div>
            ) : null}


            <form onSubmit={handleFormSubmit}>
               <div className="userName">
                  <input className='inputField' type="text" placeholder='UserName' value={userInfo.userName} onChange={handleChange} name='userName' required />
               </div>
               {!forgetPassword?
               (
              
                  <div className="password">
                     <input className='inputField' type="text" placeholder='Password' value={userInfo.password} onChange={handleChange} name='password' required />
                  </div>
               )
                  :null
              }
               <button className='buttonField' disabled={otpSent !== 2 && !login}>
                  {login ? 'Login' : 'Register'}
               </button>
               {isRegistered == 1 ? (
                  <div>
                     <p className='SuccessMessage'>
                        User Successfully Save, you can login now!
                     </p>
                  </div>
               ) : null}

               <div className="login">
                  <p className='LinkMessage'>{!login ? 'Already Registered,' : 'Not Registered,'} <span onClick={() => {
                     setLogin(1 - login);

                  }}>{!login ? 'Login!' : 'Registration!'}</span></p>
                  {login ?
                     <p className='LinkMessage' onClick={()=>{
                        // setForgetPassword(true);
                     }}>Forget Password</p>
                     : null
                  }
               </div>
            </form>


            
         </div>







      </div>
   )
}

export default Login