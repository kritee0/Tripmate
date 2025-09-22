import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },

    
    topAttractions: [
      {
        name: { type: String, required: true },
        image: { type: String, default: "" }, 
      },
    ],

   
    thingsToDo: [
      {
        title: { type: String, required: true }, 
        description: { type: String, default: "" },
        image: { type: String, default: "" }, 
      },
    ],

    images: [
      {
        type: String, 
        required: false, 
      },
    ],
    travelStyles: [
      {
        type: String,
        enum: ["City", "Food", "Temple", "Adventure"], 
      },
    ],

   
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        default: [0, 0],
      },
      address: {
        type: String,
        default: "",
      },
    },

  
    mapLink: {
      type: String,
      default: "",
    },

    
    weatherInfo: {
      temperature: { type: Number, default: 0 },
      condition: { type: String, default: "" },
      lastUpdated: { type: Date, default: null },
    },

  
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


placeSchema.index({ location: "2dsphere" });

export default mongoose.model("Place", placeSchema);

