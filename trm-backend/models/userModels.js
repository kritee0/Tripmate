import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    match: [/^[A-Za-z\s]+$/, "Name must only contain alphabets"] 
  },
  
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] 
  },
  password: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
  },agencyName: { 
    type: String, 
    trim: true,
    required: function() {
      return this.role === "TravelAgency";  
    }
  },
  address: String,
  role: {
    type: String,
    enum: ["Admin", "TravelAgency", "User",],
    default: "User",
  },
  status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},

  isVerifiedAgency: { type: Boolean, default: false },
  travelClicks: {
    type: Map,
    of: Number,
    default: {} 
  }
});



userSchema.method("isPasswordValid", async function (password) {
  return await bcrypt.compare(password, this.password);
});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


export const validateUserSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/) 
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.pattern.base": "Name must only contain alphabets",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
  }),

  password: Joi.string().min(8).max(30).required(),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/) 
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),

  address: Joi.string().optional(),
  role: Joi.string().valid("Admin", "TravelAgency", "User").optional(),
});



export const UserModel = mongoose.model("User", userSchema);

