// MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue (Leaflet doesn’t load marker icons properly with webpack/vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapView = ({ lat, long, locationName }) => {
  const position = [lat, long]; // ✅ Leaflet expects [lat, lng]

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full rounded-lg shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={position}>
          {/* Always visible tooltip above marker */}
          <Tooltip direction="top" offset={[0, -10]} permanent>
            {locationName}
          </Tooltip>

          {/* Still keep popup if you want more info on click */}
          <Popup>
            📍 {locationName} <br />
            Lat: {lat}, Lng: {long}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
 