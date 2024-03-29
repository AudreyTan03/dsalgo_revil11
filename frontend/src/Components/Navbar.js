import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import Redux useDispatch hook
import { BsSearch } from "react-icons/bs";
import { logout, updateThemePreference } from '../actions/userActions'; // Import Redux actions
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch(); // Initialize useDispatch hook

  const handleThemeChange = (theme) => {
    dispatch(updateThemePreference(theme));
    // Toggle dark mode state based on the current state value
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const toggleDarkMode = () => {
    // Toggle dark mode state
    setDarkMode(prevDarkMode => !prevDarkMode);
    // Add logic to toggle dark mode
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Add logic for real-time search
  };

  useEffect(() => {
    // Add logic to handle dark mode styles
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    // Additional logic for logout if needed
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={darkMode ? 'navbar dark-mode' : 'navbar'}>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            Revil
          </Link>
          <div className='search-container'>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='search-input'
            />
            <BsSearch className='search-icon' />
          </div>
          <div className={darkMode ? 'dark-mode-toggle dark' : 'dark-mode-toggle light'} onClick={toggleDarkMode}></div>
          <button onClick={() => handleThemeChange(darkMode ? 'light' : 'dark')}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/profile' className='nav-links' onClick={closeMobileMenu}>
                Profile
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/products' className='nav-links' onClick={closeMobileMenu}>
                Products
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/register' className='nav-links' onClick={closeMobileMenu}>
                Settings
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/login' className='nav-links' onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Secondary Navbar for Subjects */}
      <nav className='secondary-navbar'>
        <div className='navbar-container'>
          <ul className='subject-links'>
            <li className='nav-item'>
              <Link to='/math' className='nav-links' onClick={closeMobileMenu}>
                Math
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/english' className='nav-links' onClick={closeMobileMenu}>
                English
              </Link>
            </li>
            {/* Add more subjects as needed */}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
