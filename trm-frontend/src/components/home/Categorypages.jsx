import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import PlaceList from "../Place/PlaceList";

const CategoryPage = () => {
  const { category } = useParams(); // e.g., "city"
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPlaces = async () => {
      try {
        // Fetch with lowercase and backend case-insensitive regex
        const res = await fetch(
          `http://localhost:4000/api/places/travelStyle/${category}`
        );
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPlaces();
  }, [category]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)} Places
      </h1>

      {places.length > 0 ? (
        <PlaceList places={places} />
      ) : (
        <p className="text-gray-500 text-center">
          No places found for this category.
        </p>
      )}
    </div>
  );
};

export default CategoryPage;

