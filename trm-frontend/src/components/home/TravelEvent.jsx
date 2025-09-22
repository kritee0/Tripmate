import React from "react";
import Travalimg from '../../assets/TravelEvents/adventures.jpg'

const TravelEventBanner = () => {
  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        {/* Banner image */}
        <img
          src={Travalimg}
          alt="Special Travel Event"
          className="w-full h-[350px] object-cover"
        />
        {/* Overlay content */}
        <div
          className="absolute top-0 left-0 w-full h-[350px] flex flex-col justify-start px-8 md:px-16 pt-6
                     bg-gradient-to-b from-black/40 via-transparent to-transparent"
        >
         
         
          <button className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md w-fit align-middle">
        BookNow
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelEventBanner;
