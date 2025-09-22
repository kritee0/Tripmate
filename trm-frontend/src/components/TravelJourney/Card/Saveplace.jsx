import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const SavePlaceButton = ({ place, onChange }) => {
  const [isSaved, setIsSaved] = useState(false);

  const token = localStorage.getItem("token");

  
  useEffect(() => {
    if (!place || !token) return;

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
  }, [place, token]);

 
  const handleSavePlace = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/journey/save-place/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ placeId: place._id }),
      });
      if (res.ok) {
        setIsSaved(true);
        if (onChange) onChange();
      }
    } catch (err) {
      console.error("Failed to save place:", err);
    }
  };

  const handleUnsavePlace = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/journey/unsave-place/`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ placeId: place._id }),
      });
      if (res.ok) {
        setIsSaved(false);
        if (onChange) onChange(); 
      }
    } catch (err) {
      console.error("Failed to unsave place:", err);
    }
  };

  return (
    <button
      onClick={isSaved ? handleUnsavePlace : handleSavePlace}
      className="absolute top-4 right-4 p-2 rounded-full bg-white/70 hover:bg-white z-20"
    >
      <Heart
        color={isSaved ? "red" : "black"}
        size={24}
        style={{ fill: isSaved ? "red" : "none" }}
      />
    </button>
  );
};

export default SavePlaceButton;
