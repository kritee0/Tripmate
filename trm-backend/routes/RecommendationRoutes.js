import express from "express";
import {
  createRecommendation,
  getPendingRecommendations,
  approveRecommendation,
  rejectRecommendation,
  getApprovedRecommendations,
  getAllRecommendations
} from "../controllers/RecommendationController.js";

import { 
  checkAuthorization, 
  checkAdminOnly, 
  checkLoggedInUser 
} from "../middleware/checkAuthorization.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// User submits recommendation with images
router.post(
  "/",
  checkAuthorization,
  checkLoggedInUser,
  upload.array("images"), // Must match form-data key "images"
  createRecommendation
);

// Admin views pending recommendations
router.get("/pending", checkAuthorization, checkAdminOnly, getPendingRecommendations);
router.get("/all", checkAuthorization, checkAdminOnly,  getAllRecommendations );

// Admin approves/rejects
router.patch("/:id/approve", checkAuthorization, checkAdminOnly, approveRecommendation);
router.patch("/:id/reject", checkAuthorization, checkAdminOnly, rejectRecommendation);

// Get approved recommendations (Explore page)
router.get("/approved", getApprovedRecommendations);

export default router;


