import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const PlaceCard = ({ place }) => {
  return (
    <div className="border rounded-xl shadow hover:shadow-lg overflow-hidden">
      <img
        src={place.images?.length ? `http://localhost:4000${place.images[0]}` : "/no-image.jpg"}
        alt={place.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{place.name}</h3>
        <p className="text-gray-600 line-clamp-2">{place.description}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <MapPin size={16} className="mr-1" />
          {place.location?.address || "Unknown location"}
        </div>
        <Link
          to={`/places/${place._id}`}
          className="mt-3 inline-block text-cyan-600 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default PlaceCard;
