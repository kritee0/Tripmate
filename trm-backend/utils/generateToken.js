import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModels.js";

// Generate JWT token with role included
export const generateToken = (user) => {
  try {
    return jwt.sign(
      { _id: user._id, role: user.role },   // 👈 include role here
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Decode JWT token and return user
export const decodeJWT = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded?._id) {
      return null;
    }

    const foundUser = await UserModel.findById(decoded._id);
    return foundUser;
  } catch (error) {
    console.log("JWT Decode error:", error);
    return null;
  }
};
