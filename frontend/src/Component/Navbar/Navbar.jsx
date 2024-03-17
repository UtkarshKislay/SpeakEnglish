import React, { useEffect, useState } from 'react'
import './Navbar.css';
import logoImage from '../../Image/logo.jpg';
import { useSelector } from 'react-redux';
import Login from '../Login/Login';
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
const Navbar = () => {
  const userData = useSelector((state) => state.userInfo.data);
  // console.log("userData: ", userData.userName);
  const [userWantToLogin, setUserWantToLogin] = useState(false);
  const [hamburgerClicked, setHamburgerClicked] = useState(false);
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const handleLoginButton = () => {
    navigate("/login");
  }
  const handleHamburgerClick = () => {
    setHamburgerClicked(1 - hamburgerClicked);
  }
  useEffect(() => {

  }, []);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    console.log(screenSize);
    setHamburgerClicked(0);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screenSize]);
  return (
    <div>

      {(hamburgerClicked === 1 && window.innerWidth <= 768) ?
        <div
          className={`sidebar ${hamburgerClicked ? "sideBarOpen" : ""}`}
          style={{ height: `${window.innerHeight}px` }}
        >
          <div className="hamburgerIcon crossIcon" onClick={handleHamburgerClick}>
            <RxCross2 />
          </div>

          <div className="navigationButtons2">
            <div className="loginButton2" onClick={handleLoginButton}>
              <h3 className='navTexts2'>
                Login
              </h3>
            </div>
          </div>

        </div>
        : null}



      <div className="navbarContainer">
        <div className="navbarContent">
          <div className="hamburgerIcon" onClick={handleHamburgerClick}>
            <GiHamburgerMenu />
          </div>
          <div className="logo">
            <h2 className='logoText'>LearnEnglish</h2>
            <div className="lineBox"></div>
          </div>

          <div className="navigationButtons">
            <div className="loginButton" onClick={handleLoginButton}>
              <h3 className='navTexts'>
                Login
              </h3>
            </div>

          </div>


        </div>
      </div>



    </div>
  )
}

export default Navbar