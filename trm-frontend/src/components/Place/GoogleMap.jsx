// src/components/places/GoogleMap.jsx
import React, { useEffect, useRef } from "react";

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

const GoogleMap = ({ coordinates, name, address, zoom = 14 }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!coordinates || coordinates.length < 2) return;
    const [lng, lat] = coordinates;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    loadGoogleMapsScript(apiKey)
      .then((google) => {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom,
        });

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<b>${name}</b><br/>${address || ""}`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
      })
      .catch((err) => console.error("Google Maps failed to load", err));
  }, [coordinates, name, address, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", borderRadius: "12px" }}
    />
  );
};

export default GoogleMap;



