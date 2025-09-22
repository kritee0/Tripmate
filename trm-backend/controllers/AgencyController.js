import { UserModel } from "../models/userModels.js";
import AgencyApplication from "../models/AgencyApplicationModel.js";
import Notification from "../models/NotificcationModel.js";
import agencyModel from "../models/agencyModel.js";
import TravelPackage from "../models/travelpackage.js";
import Booking from "../models/BookingModel/BookModel.js";
import mongoose from "mongoose";
export const createAgency = async (req, res) => {
  try {
    const { agencyName, agencyEmail, licenseNumber } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to apply for an agency",
      });
    }

    if (req.user.role !== "User") {
      return res.status(403).json({
        success: false,
        message: "Only normal users can apply for an agency",
      });
    }

    const existing = await AgencyApplication.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for an agency",
      });
    }

    let uploadedDocs = [];
    if (req.files && req.files.length > 0) {
      uploadedDocs = req.files.map((file) => file.filename);
    }

    const application = new AgencyApplication({
      user: req.user._id,
      agencyName,
      agencyEmail,
      licenseNumber,
      documents: uploadedDocs,
      status: "Pending",
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: " Agency application submitted. Waiting for admin approval.",
      application,
    });
  } catch (err) {
    console.error("createAgency error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await AgencyApplication.find()
      .populate("user", "name email role agencyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("getApplications error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPendingApplications = async (req, res) => {
  try {
    const applications = await AgencyApplication.find({ status: "Pending" })
      .populate("user", "name email role agencyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("getPendingApplications error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await AgencyApplication.findById(req.params.id).populate(
      "user",
      "name email role agencyName"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Agency application not found",
      });
    }

    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("getApplicationById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const application = await AgencyApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Agency application not found",
      });
    }

    if (
      application.user.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    let updatedDocs = application.documents;
    if (req.files && req.files.length > 0) {
      updatedDocs = req.files.map((file) => file.filename);
    }

    Object.assign(application, req.body);
    application.documents = updatedDocs;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Agency application updated successfully",
      application,
    });
  } catch (err) {
    console.error("updateApplication error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await AgencyApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Agency application not found",
      });
    }

    if (
      application.user.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this application",
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: " Agency application deleted successfully",
    });
  } catch (err) {
    console.error("deleteApplication error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const changeAgencyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await AgencyApplication.findById(req.params.id).populate(
      "user",
      "name email role agencyName"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Agency application not found",
      });
    }

    application.status = status;
    await application.save();

    if (status === "Approved") {
  
      const agencyExists = await agencyModel.findOne({ user: application.user._id });
      if (!agencyExists) {
        await agencyModel.create({
          user: application.user._id,
          agencyName: application.agencyName,
          agencyEmail: application.agencyEmail,
          licenseNumber: application.licenseNumber,
          documents: application.documents,
        });
      }

   
      if (application.user.role !== "TravelAgency") {
        await UserModel.findByIdAndUpdate(application.user._id, {
          role: "TravelAgency",
          agencyName: application.agencyName, 
          isVerifiedAgency: true,
        });
      }

      await Notification.create({
        user: application.user._id,
        message: " Your agency has been approved! You can now continue.",
        type: "agency",
        link: "/agency/dashboard",
        isRead: false,
      });
    }

    if (status === "Rejected") {
      await Notification.create({
        user: application.user._id,
        message: "Your agency application was rejected.",
        type: "agency",
        link: "/agency/info",
        isRead: false,
      });
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (err) {
    console.error("changeAgencyStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAgencies = async (req, res) => {
  try {
    const agencies = await agencyModel.find()
      .populate("user", "name email role agencyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, agencies });
  } catch (err) {
    console.error("getAgencies error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getBookingsForAgency = async (req, res) => {
  try {
    const agencyId = req.user._id; 
    console.log("Logged-in agencyId:", agencyId);

    const packages = await TravelPackage.find({ createdBy: agencyId }).select("_id title");
    const packageIds = packages.map(pkg => pkg._id);
    console.log("Package IDs for this agency:", packageIds);

   
    let bookings;
    if (packageIds.length > 0) {
      bookings = await Booking.find({ travelPackage: { $in: packageIds } })
        .populate("user", "name email")
        .populate("travelPackage", "title prices duration")
        .sort({ createdAt: -1 });
    } else {
  
      bookings = await Booking.find()
        .populate("user", "name email")
        .populate("travelPackage", "title prices duration")
        .sort({ createdAt: -1 });
      console.log("Fallback: returned all bookings since no packages found for this agency");
    }

    console.log("Bookings found:", bookings);

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching agency bookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; 

    const booking = await Booking.findById(bookingId).populate("travelPackage", "createdBy");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.travelPackage.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAgencyProfile = async (req, res) => {
  try {
    const agency = await AgencyModel.findById(req.user.id).select("-password");
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};


export const updateAgencyProfile = async (req, res) => {
  try {
    const updated = await AgencyModel.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
