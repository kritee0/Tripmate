import mongoose from "mongoose";
const recommendedPlaceSchema = new mongoose.Schema({
  placeName: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String },
  highlights: { type: [String], validate: [arr => arr.length > 0, "At least one highlight required"] },
  images: { type: [String] },
  travelTips: { type: String },
  bestTimeToVisit: { type: String },
  culturalInfo: { type: String },
  reason: { type: String, required: true },
  experience: { type: String },
  credentials: { type: String, enum: ["Normal User", "Travel Blogger", "Local Guide"], default: "Normal User" },
  recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});


const RecommendedPlace = mongoose.model("RecommendedPlace", recommendedPlaceSchema);
export  default RecommendedPlace