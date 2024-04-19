import React from 'react';
import StudentNavbar from '../Components/StudentNav'; // Update the path as per your project structure
import HeroSection from '../Components/HeroSection';
import Footer from '../Components/Footer'; // Update the path as per your project structure


function Home() {
    return (
        <div>
            <StudentNavbar />
            <HeroSection />
            <Footer />

        </div>
    );
}

export default Home;
