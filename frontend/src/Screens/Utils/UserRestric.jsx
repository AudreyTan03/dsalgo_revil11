import React from 'react';
import { Navigate } from 'react-router-dom';
import StudentNavbar from './Components/StudentNavbar'; // Import your StudentNavbar component here
import InstructorNavbar from './Components/Navbar'; // Import your InstructorNavbar component here

const InstructorRestrict = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || !userInfo.is_active || !userInfo.is_instructor) {
    // Check if user is not logged in, not active, or is not an instructor
    return <Navigate to="/" />;
  }

  return (
    <>
      <InstructorNavbar /> {/* Render your InstructorNavbar component */}
      {children}
    </>
  );
};

export default InstructorRestrict;
