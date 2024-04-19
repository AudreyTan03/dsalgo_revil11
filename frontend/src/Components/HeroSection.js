import React from 'react';
import '../App.css';
import { Button } from './Button';
import './herosection.css';
import Footer from './Footer';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

function HeroSection() {
  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/trey.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Access userLogin state from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <>
      {/* <Navbar /> Add Navbar component */}
      {/* <div className='hero-container' style={backgroundImageStyle}> */}
      <div className='hero-container' style={backgroundImageStyle}>
        <h1>Develop New Skills without Limits</h1>
        <p>With the world's best teaching site.</p>
        <div className='hero-btns'>
          {/* Render the button only if there's no logged-in user */}
          {!userInfo && (
            <Button
              className='btns'
              buttonStyle='btn--outline'
              buttonSize='btn--large'
            >
              GET STARTED
            </Button>
          )}
        </div> 
      </div>
    </>
  );
}

export default HeroSection;
