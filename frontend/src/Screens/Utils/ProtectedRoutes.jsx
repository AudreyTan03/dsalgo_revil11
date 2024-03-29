import React from 'react';
import { Navigate } from 'react-router-dom';
import StudentNavbar from './Components/StudentNavbar'; // Import your StudentNavbar component here
import InstructorNavbar from './Components/Navbar'; // Import your InstructorNavbar component here

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = true; // Use your authentication logic here
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const role = userInfo ? userInfo.role : null;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {role === 'student' && <StudentNavbar />}
      {role === 'instructor' && <InstructorNavbar />}
      {children}
    </>
  );
};

export default AuthenticatedRoute;
