import React from "react";
import { useNavigate } from "react-router-dom";
import swayambu from "../../assets/herosection/swayambu.jpg"; // nice hero background

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Background Image */}
      <img
        src={swayambu}
        alt="Nepal"
        className="w-full h-[500px] object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Discover Nepal & Beyond
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl">
          Find breathtaking destinations, plan your journey, and make memories
          that last a lifetime.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md"
          >
            Start Your Journey →
          </button>
          <button
            onClick={() => navigate("/explore")}
            className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100"
          >
            Explore Destinations
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;










