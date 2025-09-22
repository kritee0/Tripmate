import RecommendedPlace from "../models/recommendationModel.js";
import Notification from "../models/NotificcationModel.js";
import { UserModel } from "../models/userModels.js";

// Create new recommendation (User)
export const createRecommendation = async (req, res) => {
  try {
    const {
      placeName,
      location,
      country,
      description,
      highlights,
      travelTips,
      bestTimeToVisit,
      culturalInfo,
      reason,
      experience,
      credentials,
    } = req.body;

    // Parse highlights array if sent as comma-separated string
    const parsedHighlights = typeof highlights === "string"
      ? highlights.split(",").map(h => h.trim())
      : highlights || [];

    // Handle uploaded images
    const images = req.files?.map(f => `/uploads/${f.filename}`) || [];

    // Duplicate check
    const existing = await RecommendedPlace.findOne({
      placeName: placeName.trim(),
      location: location.trim(),
      country: country.trim(),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This place has already been recommended.",
      });
    }

    const recommendation = new RecommendedPlace({
      placeName,
      location,
      country,
      description,
      highlights: parsedHighlights,
      images,
      travelTips,
      bestTimeToVisit,
      culturalInfo,
      reason,
      experience,
      credentials: credentials || "Normal User",
      recommendedBy: req.user._id,
    });

    await recommendation.save();

    // Notify the submitting user
    await Notification.create({
      user: req.user._id,
      message: `Your recommendation for "${recommendation.placeName}" has been submitted and is pending approval.`,
      type: "system",
      link: `/explore/recommendplace/${recommendation._id}`,
      place: recommendation._id,
      isRead: false,
    });

    // Notify all admins
    const admins = await UserModel.find({ role: "Admin" });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        message: `New recommendation submitted by ${req.user.name}: ${recommendation.placeName}`,
        type: "system",
        link: `/admin/recommendations/pending`,
        place: recommendation._id,
        isRead: false,
      });
    }

    res.status(201).json({ success: true, message: "Recommendation submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error submitting recommendation.",
      error: err.message,
    });
  }
};

// Get pending recommendations (Admin)
export const getPendingRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendedPlace.find({ status: "pending" })
      .populate("recommendedBy", "name email credentials");
    res.status(200).json({ success: true, recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations.",
      error: err.message,
    });
  }
};

// Approve recommendation (Admin)
export const approveRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await RecommendedPlace.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!recommendation)
      return res.status(404).json({ success: false, message: "Recommendation not found." });

    // Notify the submitting user
    await Notification.create({
      user: recommendation.recommendedBy,
      message: `Your recommendation "${recommendation.placeName}" has been approved!`,
      type: "system",
      link: `/explore/recommendplace/${recommendation._id}`,
      place: recommendation._id,
      isRead: false,
    });

    res.status(200).json({ success: true, message: "Recommendation approved!", recommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error approving recommendation.",
      error: err.message,
    });
  }
};

// Reject recommendation (Admin)
export const rejectRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await RecommendedPlace.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!recommendation)
      return res.status(404).json({ success: false, message: "Recommendation not found." });

    // Notify the submitting user
    await Notification.create({
      user: recommendation.recommendedBy,
      message: `Your recommendation "${recommendation.placeName}" has been rejected.`,
      type: "system",
      link: `/explore/recommendplace/${recommendation._id}`,
      place: recommendation._id,
      isRead: false,
    });

    res.status(200).json({ success: true, message: "Recommendation rejected!", recommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error rejecting recommendation.",
      error: err.message,
    });
  }
};

// Get approved recommendations (for Explore)
export const getApprovedRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendedPlace.find({ status: "approved" })
      .populate("recommendedBy", "name credentials");
    res.status(200).json({ success: true, recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching approved recommendations.",
      error: err.message,
    });
  }
};
// Get all recommendations (Admin)
export const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendedPlace.find()
      .populate("recommendedBy", "name email credentials")
      .sort({ createdAt: -1 }); // newest first
    res.status(200).json({ success: true, recommendations });
  } catch (err) {
    console.error("Error fetching all recommendations:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching all recommendations.",
      error: err.message,
    });
  }
};




