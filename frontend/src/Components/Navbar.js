import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation hook
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch } from "react-icons/bs";
import { logout, updateThemePreference } from '../actions/userActions';
import './Navbar.css';

function Navbar({ handleSearch, searchTerm, categories, selectedCategory, onCategoryChange }) {
  const [click, setClick] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const location = useLocation(); // Use useLocation hook

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  console.log('userInfo:', userInfo);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    closeMobileMenu();
  };
  return (
    <>
      <nav className={darkMode ? 'navbar dark-mode' : 'navbar'}>
        <div className='navbar-container'>
          <Link style={{marginRight:'1rem'}} to='/' className='navbar-logo' onClick={closeMobileMenu}>
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
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            {/* <li className='nav-item'>
              <Link to='/cart' className='nav-links' onClick={closeMobileMenu}>
                CartItems
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/products' className='nav-links' onClick={closeMobileMenu}>
                Products
              </Link>
            </li> */}
            <li className='nav-item'>
              <Link to='/register' className='nav-links' onClick={closeMobileMenu}>
                Register
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/login' className='nav-links' onClick={handleLogout}>
                Login
              </Link>
            </li>
            {/* Conditionally render admin panel link based on user role */}
            {userInfo && userInfo.isAdmin && ( // Check if userInfo exists and user is admin
              <li className='nav-item'>
                <Link to='/admin' className='nav-links' onClick={closeMobileMenu}>
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <nav className='secondary-navbar'>
        <div className='navbar-container'>
          <ul className='subject-links'>
            {categories && categories.map(category => (
              <li key={category.id} className='nav-item'>
                <a href="#" className='nav-links' onClick={(e) => { e.preventDefault(); handleCategoryClick(category.id); }}>
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;