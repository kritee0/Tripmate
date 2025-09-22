import mongoose from "mongoose";

const travelInterestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interest: {
      type: String,
      enum: ["City", "Food", "Temple", "Adventure"], 
      required: true,
    },
    clicks: {
      type: Number,
      default: 1, 
    },
  },
  { timestamps: true }
);

travelInterestSchema.index({ user: 1, interest: 1 }, { unique: true });

export default mongoose.model("TravelInterest", travelInterestSchema);
