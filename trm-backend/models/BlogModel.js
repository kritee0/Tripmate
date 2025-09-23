import mongoose from "mongoose";

const travelBlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String }, // single featured image
    tags: { type: [String] },
    status: { type: String, enum: ["draft", "ready", "published"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Fix OverwriteModelError
const TravelBlog = mongoose.models.TravelBlog || mongoose.model("TravelBlog", travelBlogSchema);

export default TravelBlog;





