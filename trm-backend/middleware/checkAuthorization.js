import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModels.js";


export const checkAuthorization = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.body?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded._id) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const checkTravelAgencyOrAdmin = (req, res, next) => {
  if (req.user.role !== "TravelAgency" && req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Access denied." });
  }
  next();
};


export const checkLoggedInUser = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ success: false, message: "Please log in." });
  }
  next();
};


export const checkAdminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};

export const checkTravelAgency = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (req.user.role !== "agency") {
    return res.status(403).json({ success: false, message: "Agency access required." });
  }
  next();
};

