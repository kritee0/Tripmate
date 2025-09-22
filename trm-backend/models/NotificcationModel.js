import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["agency", "booking", "system", "other", "trip-reminder"],
      default: "system",
    },
    link: { type: String }, 
    isRead: { type: Boolean, default: false },
    reminderDate: { type: Date }, 
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" }, 
    journey: { type: mongoose.Schema.Types.ObjectId, ref: "TravelJourney" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;

