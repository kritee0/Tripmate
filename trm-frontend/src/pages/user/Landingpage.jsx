import React from 'react'
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import HeroSection from '../../components/Landingpages/HeroSection';
import LandingSections from '../../components/Landingpages/LandingSection';
import Footer from '../../components/common/Footer';

const Landing = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/journey');
  };

  return (
    <div>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavBar />
      </div>

      {/* Page content (add padding so it's not hidden behind navbar) */}
      <div className="pt-16">
        <HeroSection />
        <LandingSections />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;



