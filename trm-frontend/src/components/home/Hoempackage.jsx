import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Heart, Calendar } from "lucide-react";

const HomePackagesSection = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/packages?limit=3&sortBy=bookingsCount"
        );
        setPackages(res.data.data || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600 py-10">Loading packages...</p>;
  if (!packages.length)
    return <p className="text-center text-gray-600 py-10">No packages available.</p>;

  return (
    <section className="py-10 bg-white px-4">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
        Popular Travel Packages
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg._id} pkg={pkg} onClick={() => navigate(`/packages/${pkg._id}`)} />
        ))}
      </div>
    </section>
  );
};

const PackageCard = ({ pkg, onClick }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 h-full"
      onClick={onClick}
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
      <div className="h-36 w-full overflow-hidden">
        <img
          src={pkg.image ? `http://localhost:4000${pkg.image}` : "https://via.placeholder.com/300x150"}
          alt={pkg.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-grow p-4">
        {/* Agency */}
        <p className="text-xs font-semibold text-green-700 mb-1">
          {pkg.agency?.name || "Travel Agency"}
        </p>

        {/* Title */}
        <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-2">
          {pkg.name || pkg.title}
        </h3>

        {/* Duration */}
        <div className="flex items-center text-gray-500 text-sm mb-2 gap-1">
          <Calendar className="w-4 h-4" /> {pkg.duration} days
        </div>

        {/* Highlights */}
        {pkg.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
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

        {/* Price */}
        <p className="text-lg font-bold text-gray-900 mb-2">
          Rs. {pkg.price?.toLocaleString()} <span className="text-xs text-gray-500">/person</span>
        </p>

        {/* Book Now */}
        <button
          className="mt-auto bg-blue-700 text-white py-2 rounded-lg text-sm hover:bg-blue-800 transition"
        >
          ViewDetails
        </button>
      </div>
    </div>
  );
};

export default HomePackagesSection;










