import mongoose from "mongoose";
import Joi from "joi";

const agencyApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    agencyName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      match: [/^[A-Za-z\s]+$/, "Agency name must contain only letters and spaces"],
    },

    agencyEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    licenseNumber: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      match: [/^[A-Za-z0-9]+$/, "License number must be alphanumeric"],
    },

    
    documents: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.every((doc) => typeof doc === "string"),
        message: "Documents must be an array of file names (strings)",
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


export const validateAgencyApplication = Joi.object({
  agencyName: Joi.string().pattern(/^[A-Za-z\s]+$/).min(3).max(100).required(),
  agencyEmail: Joi.string().email().required(),
  licenseNumber: Joi.string().alphanum().min(6).max(20).required(),
  documents: Joi.array().items(Joi.string()).min(1).required(), 
  status: Joi.string().valid("Pending", "Approved", "Rejected").optional(),
});

export default mongoose.model("AgencyApplication", agencyApplicationSchema);

