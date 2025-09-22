import mongoose from "mongoose";
import Place from "./models/PlaceModel.js"; 


mongoose.connect("mongodb://127.0.0.1:27017/tms")
  .then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.log(err));


const places = [
  {
    name: "Pokhara",
    description: "Pokhara is a beautiful lakeside city in Nepal with stunning views of the Annapurna mountains.",
    TopAttraction: ["Davis Falls","Phewa Lake","Sarangkot Hill"],
    images: [
      "https://i.imgur.com/abc123.jpg",
      "https://i.imgur.com/def456.jpg"
    ],
    location: "Pokhara, Nepal",
    mapLink: "https://goo.gl/maps/example",
    weatherInfo: { temperature: "24°C", condition: "Sunny" }
  },
  {
    name: "Kathmandu",
    description: "Kathmandu is the capital city of Nepal, known for its rich culture and heritage sites.",
    TopAttraction: ["Pashupatinath","Boudhanath","Thamel"],
    images: [
      "https://i.imgur.com/ghi789.jpg",
      "https://i.imgur.com/jkl012.jpg"
    ],
    location: "Kathmandu, Nepal",
    mapLink: "https://goo.gl/maps/example",
    weatherInfo: { temperature: "22°C", condition: "Cloudy" }
  }
];


const seedDB = async () => {
  try {
    await Place.deleteMany({}); 
    await Place.insertMany(places);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.log("Error seeding database:", err);
  } finally {
    mongoose.disconnect();
  }
};
seedDB();
