import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar'; // Update the path as per your project structure
import HeroSection from '../Components/HeroSection';
import Footer from '../Components/Footer'; // Update the path as per your project structure

function Home() {
    const navigate = useNavigate();

    // Check the user type in localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userType = userInfo ? userInfo.user_type : null;
    console.log('User type:', userType);

    // Redirect to studenthomescreen if user is a student
    React.useEffect(() => {
        if (userType === 'student') {
            console.log('Redirecting to /studenthomescreen');
            navigate('/studenthomescreen', { replace: true });
        }
    }, [userType, navigate]);

    // Render the components if not redirecting
    return (
        <div>
            <Navbar />
            <HeroSection />
            <Footer />
        </div>
    );
}

export default Home;