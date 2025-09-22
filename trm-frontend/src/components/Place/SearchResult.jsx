// src/pages/places/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import Loader from "../../components/common/Loader";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const queryParams = useQuery();
  const query = queryParams.get("query");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:4000/api/places/search/${query}`);
        const data = await res.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <Loader />;

  if (!places.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 text-lg">
          No results found for <span className="font-semibold">"{query}"</span>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for <span className="text-green-800">"{query}"</span>
      </h2>

      <div className="space-y-6">
        {places.map((place) => (
          <Link
            to={`/places/${place._id}`}
            key={place._id}
            className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <div className="md:w-1/3 h-52 md:h-auto">
              {place.images?.length > 0 ? (
                <img
                  src={`http://localhost:4000${place.images[0]}`}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1 p-5 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{place.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star size={18} />
                  <span className="ml-1 font-medium">{place.averageRating?.toFixed(1) || "0.0"}</span>
                  <span className="ml-1 text-sm text-gray-500">({place.reviewCount || 0} reviews)</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-1 text-red-500" />
                {place.address || "Unknown location"}
              </div>

              <p className="mt-3 text-gray-700 line-clamp-3">{place.description || "No description available"}</p>

              <button className="mt-4 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
