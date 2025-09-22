import React, { useState } from "react";
import { MapPinIcon, CalendarIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

const TripCard = ({ trip, userId, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/travel-journey/trip/${trip._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete trip");
      }

      onUpdate(); 
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition relative">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

     
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            trip.status === "planned"
              ? "bg-blue-100 text-blue-800"
              : trip.status === "ongoing"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {trip.status}
        </span>
      </div>

      
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <MapPinIcon className="w-4 h-4 mr-1" />
        {trip.destination}
      </div>

 
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <CalendarIcon className="w-4 h-4 mr-1" />
        {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
      </div>

    
      <div className="absolute top-4 right-4 flex space-x-2">
   
        <button
          onClick={() => alert("Edit functionality can be implemented here")}
          className="p-1 rounded hover:bg-gray-100"
        >
          <PencilIcon className="w-5 h-5 text-gray-500" />
        </button>

      
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`p-1 rounded hover:bg-gray-100 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default TripCard;
