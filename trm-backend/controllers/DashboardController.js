import TravelPackage from "../models/travelpackage.js";
import Booking from "../models/BookingModel/BookModel.js"
import Agency from "../models/agencyModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    
    let filter = {};
    if (req.user.role === "TravelAgency") {
      const agency = await Agency.findOne({ user: req.user._id });
      if (agency) {
        filter = { createdBy: agency._id }; 
      }
    }

    
    const totalPackages = await TravelPackage.countDocuments(filter);
    const totalBookings = await Booking.countDocuments(filter);
    const pendingBookings = await Booking.countDocuments({
      ...filter,
      status: "Pending",
    });

   
    const totalAgencies =
      req.user.role === "Admin" ? await Agency.countDocuments() : undefined;

    res.status(200).json({
      success: true,
      stats: {
        totalPackages,
        totalBookings,
        pendingBookings,
        ...(req.user.role === "Admin" && { totalAgencies }),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
