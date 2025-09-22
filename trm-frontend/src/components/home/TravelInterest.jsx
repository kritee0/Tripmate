import React from "react";
import { useNavigate } from "react-router-dom";
import CityImg from '../../assets/FeaturesPlace/Dharan.jpg';
import foodImg from '../../assets/FeaturesPlace/food.jpg';
import RaftingImg from '../../assets/FeaturesPlace/Rafting.jpg';
import TempleImg from '../../assets/FeaturesPlace/Temple.jpg';

const interests = [
  { id: 1, name: "City", image: CityImg, tagline: "Explore beautiful cities of Nepal." },
  { id: 2, name: "Food", image: foodImg, tagline: "Experience Nepal through its delicious local specialties." },
  { id: 3, name: "Temple", image: TempleImg, tagline: "Discover historic temples, culture comes alive." },
  { id: 4, name: "Adventure", image: RaftingImg, tagline: "Exciting experiences for thrill seekers." },
];

const TravelInterest = () => {
  const navigate = useNavigate();

  const handleClick = (interest) => {
    // Navigate with query param 'travelStyle' instead of 'category'
    navigate(`/category/${interest.name.toLowerCase()}`);
  };

  return (
    <div className="my-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-green-800">Choose Your Travel Style</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Pick a category and explore destinations that match your interests!
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {interests.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className="cursor-pointer transform transition duration-300 flex flex-col items-center rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 hover:scale-105 p-2 bg-white w-40 md:w-44"
          >
            <div className="w-full h-40 overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mt-2 text-green-800">{item.name}</h3>
            <p className="text-gray-600 text-sm text-center mt-1">{item.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelInterest;
