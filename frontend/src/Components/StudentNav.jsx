import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import './Navbar.css';
import { BsSearch } from "react-icons/bs";

function StudentNav({ handleSearch, searchTerm, categories, selectedCategory, onCategoryChange }) {
  const [click, setClick] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    closeMobileMenu();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    // Add logic to handle dark mode styles
  }, [darkMode]);

  // Determine the logo text based on user type
  const logoText = userInfo && userInfo.user_type === 'instructor' ? 'Revil' : 'Revil student';

  // Determine the logo link based on user type
  const logoLink = userInfo && userInfo.user_type === 'instructor' ? '/' : '/studenthomescreen';
  const ProductLink = userInfo && userInfo.user_type === 'instructor' ? '/products' : '/Stuproducts';

  return (
    <>
      <nav className={darkMode ? 'navbar dark-mode' : 'navbar'}>
        <div className='navbar-container'>
          <Link to={logoLink} className='navbar-logo' onClick={closeMobileMenu}>
            {logoText}
          </Link>
          <div style={{marginLeft:'1rem'}} className='search-container'>
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
            <li className='nav-item'>
              <Link to='/cart' className='nav-links' onClick={closeMobileMenu}>
                Cart
              </Link>
            </li>

            <li className='nav-item'>
              <Link to={ProductLink} className='nav-links' onClick={closeMobileMenu}>
                Products
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/profile' className='nav-links' onClick={closeMobileMenu}>
                Profile
              </Link>
            </li>

            <li className='nav-item'>
              <Link to="/" className='nav-links' onClick={handleLogout}>
                Logout
              </Link>
            </li>
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

export default StudentNav;
