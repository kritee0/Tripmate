// src/components/places/PlaceDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SavePlaceButton from "../TravelJourney/Card/Saveplace";
import { Star, MapPin, Cloud, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../common/Loader";
import ReviewSection from "../Place/Review";
import GoogleMap from "./GoogleMap"; // updated robust version

import "leaflet/dist/leaflet.css";
import MapView from "./Mapview";

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [recommendedStyle, setRecommendedStyle] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);

  // Fetch place data
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/places/${id}`);
        const data = await res.json();
        setPlace(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  // Fetch weather data
  useEffect(() => {
    if (!place?.location?.coordinates) return;

    const fetchWeather = async () => {
      const [lng, lat] = place.location.coordinates; // [lng, lat]
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
        );
        const data = await res.json();
        setWeatherInfo({
          temperature: data.main.temp,
          condition: data.weather[0].description,
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
  }, [place]);

  // Check if saved
  useEffect(() => {
    if (!place) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const checkSaved = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/journey/is-saved/${place._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setIsSaved(data.isSaved);
      } catch (err) {
        console.error(err);
      }
    };
    checkSaved();
  }, [place]);

  // Record user clicks for recommendation
  useEffect(() => {
    if (!place) return;
    const token = localStorage.getItem("token");
    if (!token || !place.travelStyles) return;

    const recordClicks = async () => {
      try {
        for (const style of place.travelStyles) {
          await fetch("http://localhost:4000/api/users/travel/click", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ style }),
          });
        }
      } catch (err) {
        console.error("Error recording travel clicks:", err);
      }
    };
    recordClicks();
  }, [place]);

  // Fetch recommended travel style for this user
  useEffect(() => {
    const fetchRecommendation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:4000/api/users/travel/recommendation",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.recommended) setRecommendedStyle(data.recommended);
      } catch (err) {
        console.error("Error fetching recommendation:", err);
      }
    };
    fetchRecommendation();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );

  if (!place) return <p className="text-center mt-10">Place not found</p>;

  const nextImage = () =>
    setCurrentImage((prev) =>
      prev === place.images.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? place.images.length - 1 : prev - 1
    );

  return (
    <div className="relative">
      {/* Hero section */}
      <div className="relative h-[450px] w-full">
        <div className="absolute inset-0 bg-blue-600" />
        {place.images?.length > 0 ? (
          <img
            src={`http://localhost:4000${place.images[currentImage]}`}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}

        {/* Carousel buttons */}
        {place.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Save Place Button */}
        <SavePlaceButton
          place={place}
          onChange={(saved) => setIsSaved(saved)}
        />

        {/* Recommended Badge */}
        {recommendedStyle && place.travelStyles.includes(recommendedStyle) && (
          <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-20">
            Recommended
          </span>
        )}

        {/* Text overlay */}
        <div className="absolute bottom-8 left-8 text-white z-10">
          <h1 className="text-4xl font-bold">{place.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star /> {place.averageRating?.toFixed(1) || "0.0"} (
              {place.reviewCount || 0})
            </div>
            {weatherInfo && (
              <div className="flex items-center gap-1">
                <Cloud /> {weatherInfo.temperature}°C, {weatherInfo.condition}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <MapPin />
            <span>{place.address}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="-mt-16 relative z-20 bg-white rounded-t-3xl shadow-lg p-6 max-w-6xl mx-auto">
        <p className="text-gray-700 mb-6">{place.description}</p>

        {/* Top Attractions */}
        {place.topAttractions?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Top Attractions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {place.topAttractions.map((attr, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden shadow-md transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {attr.image && (
                    <img
                      src={`http://localhost:4000${attr.image}`}
                      alt={attr.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white font-medium">{attr.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Things To Do */}
        {place.thingsToDo?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Things To Do</h2>
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {place.thingsToDo.map((todo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-2"
                >
                  {todo.image && (
                    <img
                      src={`http://localhost:4000${todo.image}`}
                      alt={todo.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{todo.title}</h3>
                    <p className="text-gray-600 text-sm">{todo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {place.location?.coordinates?.length === 2 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            {/* <GoogleMap
              coordinates={place.location.coordinates} // [lng, lat]
              name={place.name}
              address={place.address}
            /> */}

            <MapView
              lat={place.location.coordinates[1]}
              long={place.location.coordinates[0]}

              locationName={place.name}
            />
          </div>
        ) : (
          <p className="text-gray-500 mt-2">
            Location not available for this place.
          </p>
        )}

        {/* Plan Next Trip Card */}
        <div
          onClick={() =>
            navigate("/journey", {
              state: { selectedPlace: place, scrollToNextTrip: true },
            })
          }
          className="mb-8 p-4 border rounded-xl shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition"
        >
          <div className=" text-white p-3 rounded-full text-xl flex items-center justify-center"></div>
          <div>
            <h3 className="text-lg font-bold text-green-900">
              Plan Your Next Trip ?{" "}
            </h3>
            <p className="text-gray-600 text-sm">Click here to plantrip.</p>
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection placeId={id} />
      </div>
    </div>
  );
};

export default PlaceDetail;
