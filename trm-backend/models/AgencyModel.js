import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    agencyName: { type: String, required: true, trim: true },

    agencyEmail: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"] 
    },

    licenseNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },

    documents: {
      type: [String],   
    },
  },
  { timestamps: true }
);

export default mongoose.model("Agency", agencySchema);
