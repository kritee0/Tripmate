// models/BlogFeedback.js
import mongoose from "mongoose";

const blogFeedbackSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "TravelBlog", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BlogFeedback = mongoose.model("BlogFeedback", blogFeedbackSchema);
export default BlogFeedback;
