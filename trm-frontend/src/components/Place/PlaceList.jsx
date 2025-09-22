import React from "react";
import PlaceCard from "./PlaceCard";

const PlaceList = ({ places }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
};

export default PlaceList;
