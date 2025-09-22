import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlaceList from "./PlaceList";
import Loader from "../../components/common/Loader";
import TravelInterest from "../home/TravelInterest";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const travelStyle = searchParams.get("travelStyle"); // read query param

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const url = travelStyle
          ? `http://localhost:4000/api/places?travelStyle=${travelStyle}`
          : `http://localhost:4000/api/places`;

        const res = await fetch(url);
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [travelStyle]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {travelStyle
          ? `${travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)} Places`
          : "Explore Popular Places"}
      </h1>

      <TravelInterest />

      {places.length > 0 ? (
        <PlaceList places={places} />
      ) : (
        <p className="text-gray-500 text-center">No places found.</p>
      )}
    </div>
  );
};

export default Places;
