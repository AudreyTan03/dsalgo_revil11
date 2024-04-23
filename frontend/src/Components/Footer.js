import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#161A30',
      color: 'white',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 20px'
      }}>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link>
        {/* <p>Privacy and Policy</p> */}
      </div>
    </footer>
  );
};

export default Footer;
