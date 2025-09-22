import mongoose from "mongoose";

const travelBlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  summary: { type: String },
  images: { type: [String] },
  tags: { type: [String] },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Fix OverwriteModelError
const TravelBlog = mongoose.models.TravelBlog || mongoose.model("TravelBlog", travelBlogSchema);

export default TravelBlog;




