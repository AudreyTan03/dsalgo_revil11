import React from 'react';
import Navbar from '../Components/Navbar'; // Update the path as per your project structure
import HeroSection from '../Components/HeroSection';
import Footer from '../Components/Footer'; // Update the path as per your project structure

function Home() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <Footer />
        </div>
    );
}

export default Home;
