import mongoose from "mongoose";

// ------------------- ITINERARY -------------------
const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String },
  activities: [String],
  meals: [String],
  accommodation: String,
});

// ------------------- POLICY -------------------
const policySchema = new mongoose.Schema({
  included: [String],
  excluded: [String],
  cancellation: String,
  payment: String,
});

// ------------------- TRAVEL PACKAGE -------------------
const travelPackageSchema = new mongoose.Schema(
  {
    // ------------------- BASIC INFORMATION -------------------
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    overview: { type: String, required: true },
    highlights: [String],

    // ------------------- CATEGORY & SEASON -------------------
    category: { type: String, enum: ["Mountain", "Culture", "Trekking", "City", "Adventure"], required: true },
    bestSeason: { type: String },

    // ------------------- TRANSPORT -------------------
    transportAvailableOnArrival: { type: Boolean, default: false },

    // ------------------- ITINERARY -------------------
    itinerary: [itineraryDaySchema],

    // ------------------- POLICY -------------------
    policy: policySchema,

    // ------------------- AGENCY -------------------
    agency: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },

    // ------------------- METADATA -------------------
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, default: 0 },
    bookingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TravelPackage = mongoose.model("TravelPackage", travelPackageSchema);
export default TravelPackage;





