import React from 'react';
import '../App.css';
import { Button } from './Button';
import './herosection.css';
import Footer from './Footer';
// import Navbar from './Navbar'; // Import Navbar component

function HeroSection() {
  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/trey.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <>
      {/* <Navbar /> Add Navbar component */}
      {/* <div className='hero-container' style={backgroundImageStyle}> */}
      <div className='hero-container' style={backgroundImageStyle}>
        <h1>Develop New Skills without Limits</h1>
        <p>With the world's best teaching site.</p>
        <div className='hero-btns'>
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
          >
            GET STARTED
          </Button>
        </div> 
      </div>
    </>
  );
}

export default HeroSection;
