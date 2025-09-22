import React, { useState, useEffect } from "react";
import FeaturesSection from "../../components/home/FeaturesSection";
import TravelInterest from "../../components/home/TravelInterest";
import PlaceList from "../../components/Place/PlaceList";
import Loader from "../../components/common/Loader";
import HomePackagesSection from "../../components/home/Hoempackage" 
import NavBarLoggedIn from "../../components/common/Navbar1";

const Homepage = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/places");
        const data = await res.json();
        setPlaces(data);
        setFilteredPlaces(data);
      } catch (err) {
        console.error("Error fetching places:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const handleSelectTravelStyle = (style) => {
    setSelectedStyle(style);
    if (style) {
      const filtered = places.filter((place) =>
        place.travelStyles.includes(style)
      );
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full bg-white"> 
   
      
     
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavBarLoggedIn />
      </div>

      {/* 🔹 Page content with padding so it doesn’t overlap navbar */}
      <div className="pt-16">
        <div className="w-full py-10 bg-white">
          <FeaturesSection />
        </div>
      
      <div className="w-full py-10 bg-white">
        <TravelInterest onSelect={handleSelectTravelStyle} />
      </div>

      
      <div className="w-full py-10 bg-white">
        <HomePackagesSection /> 
      </div>

    
      <div className="w-full py-10 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6">
          {selectedStyle
            ? `Explore ${selectedStyle} Places`
            : "Explore Popular Places"}
        </h2>
        {filteredPlaces.length > 0 ? (
          <PlaceList places={filteredPlaces} />
        ) : (
          <p className="text-gray-500 text-center">No places found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Homepage;

