import React, { useState } from "react";
import { MapPin, Heart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePackageCard = ({ pkg }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/packages/${pkg._id}`);
  };

  return (
    <div
      className="relative flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer w-56"
    >
      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
        className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:scale-110 transition z-10"
      >
        <Heart className={`w-4 h-4 ${liked ? "text-red-500" : "text-gray-400"}`} />
      </button>

      {/* Image */}
      <div className="h-32 w-full overflow-hidden">
        <img
          src={pkg.image ? `http://localhost:4000${pkg.image}` : "https://via.placeholder.com/300x150"}
          alt={pkg.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Main Info */}
      <div className="flex flex-col p-3 flex-grow">
        {/* Agency */}
        <p className="text-xs font-semibold text-green-700 mb-1">
          {pkg.agency?.name || "Travel Agency"}
        </p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
          {pkg.name}
        </h3>

        {/* Duration & Price */}
        <div className="flex justify-between items-center text-gray-500 text-xs mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {pkg.duration} days
          </span>
          <span className="font-bold text-gray-900 text-sm">
            Rs. {pkg.price?.toLocaleString()}
          </span>
        </div>

        {/* Short Overview */}
        {pkg.overview && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {pkg.overview}
          </p>
        )}

        {/* Highlights */}
        {pkg.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {pkg.highlights.slice(0, 2).map((place, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-xs"
              >
                <MapPin className="w-2.5 h-2.5 text-green-700" /> {place}
              </span>
            ))}
            {pkg.highlights.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                +{pkg.highlights.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="mt-2 bg-green-600 text-white py-1 rounded text-xs hover:bg-green-700 shadow-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default HomePackageCard;




