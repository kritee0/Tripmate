import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom"; // import for navigation

const FeaturesSection = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // initialize navigate

  useEffect(() => {
    const fetchTopRatedPlaces = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/places/featured/top-rated?limit=2"
        );

        if (data.success) {
          setPlaces(data.places);
        } else {
          setError("Failed to load featured places");
        }
      } catch (err) {
        setError("Error fetching featured places");
        console.error("Error fetching top-rated places:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedPlaces();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 text-center px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600">Loading featured destinations...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50 text-center px-4 sm:px-6 lg:px-8">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
          Featured Destinations
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {places.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => navigate(`/places/${place._id}`)} // navigate on click
            >
              <img
                src={place.images?.[0] || "http://localhost:4000/uploads/placeholder.jpg"} 
                alt={place.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-900">{place.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {place.description}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                  <span className="ml-1 font-medium text-gray-700 text-sm">
                    {place.averageRating ? place.averageRating.toFixed(1) : "N/A"}
                  </span>
                  <span className="ml-2 text-gray-500 text-xs">
                    ({place.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;



