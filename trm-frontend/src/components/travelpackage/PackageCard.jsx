import React, { useState } from "react";
import { MapPin, Heart, Calendar } from "lucide-react";

const PackageCard = ({ pkg, onClick }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer h-full"
      onClick={() => onClick(pkg)}
    >
      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition z-10"
      >
        <Heart className={`w-5 h-5 ${liked ? "text-red-500" : "text-gray-400"}`} />
      </button>

      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={pkg.image ? `http://localhost:4000${pkg.image}` : "https://via.placeholder.com/300x150"}
          alt={pkg.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Main Info */}
      <div className="flex flex-col p-4 flex-grow">
        {/* Agency */}
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
          {pkg.agency?.name || "Travel Agency"}
        </p>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
          {pkg.name}
        </h3>

        {/* Duration & Price */}
        <div className="flex justify-between items-center text-gray-500 text-sm mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {pkg.duration} days
          </span>
          <span className="font-bold text-gray-900">
            Rs. {pkg.price?.toLocaleString()}
          </span>
        </div>

        {/* Short Overview */}
        {pkg.overview && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {pkg.overview}
          </p>
        )}

        {/* Itinerary Preview */}
        {pkg.itinerary?.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-700 mb-1">Itinerary:</p>
            <ul className="text-xs text-gray-600 list-disc list-inside">
              {pkg.itinerary.slice(0, 2).map((day) => (
                <li key={day.day}>
                  Day {day.day}: {day.title || "Activities planned"}
                </li>
              ))}
              {pkg.itinerary.length > 2 && (
                <li className="text-gray-500">+{pkg.itinerary.length - 2} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Best Season */}
        {pkg.bestSeason && (
          <p className="text-xs text-blue-600 font-medium mt-auto">
            Best Season: {pkg.bestSeason}
          </p>
        )}

        {/* Places Included */}
        {pkg.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {pkg.highlights.slice(0, 2).map((place, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-xs"
              >
                <MapPin className="w-3 h-3 text-green-700" /> {place}
              </span>
            ))}
            {pkg.highlights.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                +{pkg.highlights.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCard;








