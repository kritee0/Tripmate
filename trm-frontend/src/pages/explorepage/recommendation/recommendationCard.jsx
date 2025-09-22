// src/components/recommendation/RecommendationCard.jsx
import React, { useState } from "react";

const RecommendationCard = ({ rec }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition w-80 h-[28rem] flex flex-col overflow-hidden">
        
        {/* User Info */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-800">
            {rec.recommendedBy?.name ? rec.recommendedBy.name[0] : "T"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {rec.recommendedBy?.name || "Traveler"}
            </p>
            <p className="text-xs text-gray-600">{rec.credentials}</p>
          </div>
        </div>

        {/* Place Image */}
        {rec.images?.length > 0 ? (
          <img
            src={`http://localhost:4000${rec.images[0]}`}
            alt={rec.placeName}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
            🏞️
          </div>
        )}

        {/* Place Info */}
        <div className="flex-1 p-3 flex flex-col">
          <h3 className="text-lg font-semibold text-green-900">{rec.placeName}</h3>
          <p className="text-sm text-black-700 mb-1">
            {rec.location}, {rec.country}
          </p>

          {/* Truncated Description */}
          {rec.description && (
            <p className="text-sm text-black-900 line-clamp-3 mb-2">{rec.description}</p>
          )}

          {/* View Details Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-auto px-3 py-1 bg-green-900 text-white rounded hover:bg-green-700 transition"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal for Full Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-gray-500 text-xl font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-2">{rec.placeName}</h3>
            <p className="text-gray-600 mb-1">
              <strong>Location:</strong> {rec.location}, {rec.country}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Recommended by:</strong> {rec.recommendedBy?.name || "Traveler"} ({rec.credentials})
            </p>
            
            {rec.description && <p className="mb-1"><strong>Description:</strong> {rec.description}</p>}
            {rec.highlights?.length > 0 && <p className="mb-1"><strong>Highlights:</strong> {rec.highlights.join(", ")}</p>}
            {rec.travelTips && <p className="mb-1"><strong>Travel Tips:</strong> {rec.travelTips}</p>}
            {rec.bestTimeToVisit && <p className="mb-1"><strong>Best Time:</strong> {rec.bestTimeToVisit}</p>}
            {rec.culturalInfo && <p className="mb-1"><strong>Cultural Info:</strong> {rec.culturalInfo}</p>}
            {rec.reason && <p className="mb-1"><strong>Reason:</strong> {rec.reason}</p>}
            {rec.experience && <p className="mb-1"><strong>Experience:</strong> {rec.experience}</p>}

            {rec.images?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {rec.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:4000${img}`}
                    alt={`img-${idx}`}
                    className="h-24 w-full object-cover rounded cursor-pointer"
                    onClick={() => window.open(`http://localhost:4000${img}`, "_blank")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendationCard;






