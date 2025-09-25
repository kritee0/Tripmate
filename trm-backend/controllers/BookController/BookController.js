import Booking from "../../models/BookingModel/BookModel.js";
import TravelPackage from "../../models/travelpackage.js";

// ✅ Create Booking
export const createBooking = async (req, res) => {
  try {
    const { packageId, numberOfTravellers, travelDate, bookingId } = req.body;

    // Check package exists
    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    // Check user is logged in
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User must be logged in" });
    }

    // Travel date required
    if (!travelDate) {
      return res.status(400).json({
        success: false,
        message: "Travel date is required",
      });
    }

    // ✅ Ensure travelDate is not in the past
    const today = new Date();
    const selectedDate = new Date(travelDate);
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: "Travel date cannot be in the past.",
      });
    }

    // Calculate total price
    const packagePrice = travelPackage.price || 0;
    const totalPrice = packagePrice * Number(numberOfTravellers || 1);

    // Create booking
    const booking = await Booking.create({
      user: userId,
      travelPackage: packageId,
      numberOfTravellers: numberOfTravellers || 1,
      totalPrice,
      bookingDate: new Date(),
      bookingId,
      status: "Pending",
    });

    // Increment package booking count
    await TravelPackage.findByIdAndUpdate(packageId, { $inc: { bookingsCount: 1 } });

    // After creating booking
const populatedBooking = await Booking.findById(booking._id)
  .populate("user", "-password -__v") // includes all registration info except password
  .populate("travelPackage", "title price duration");




    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: "Booking successful!",
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("travelPackage", "title price duration")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User must be logged in" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("travelPackage", "title price duration")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Cancel booking (User or Admin)
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User must be logged in" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Only owner or admin can cancel
    if (booking.user.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    booking.status = "Cancelled";
    await booking.save();

    // Decrement package booking count
    await TravelPackage.findByIdAndUpdate(booking.travelPackage, { $inc: { bookingsCount: -1 } });

    res.status(200).json({ success: true, message: "Booking cancelled successfully", data: booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Agency updates booking status (Confirm/Cancel)
export const updateBookingStatusByAgency = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body;

    const booking = await Booking.findById(bookingId).populate("travelPackage", "createdBy");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Only the agency who created the package can update status
    if (booking.travelPackage.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (action === "confirm") booking.status = "Confirmed";
    else if (action === "cancel") booking.status = "Cancelled";
    else return res.status(400).json({ success: false, message: "Invalid action" });

    await booking.save();

    res.status(200).json({ success: true, message: `Booking ${booking.status}`, booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get bookings for agency's packages
export const getAgencyBookings = async (req, res) => {
  try {
    const agencyId = req.user?._id;
    if (!agencyId) {
      return res.status(401).json({ success: false, message: "Agency must be logged in" });
    }

    // Find bookings where the package was created by this agency
    const bookings = await Booking.find()
      .populate({
        path: "travelPackage",
        match: { createdBy: agencyId }, // only packages created by this agency
        select: "title price duration createdBy",
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Filter out bookings where travelPackage was not matched
    const agencyBookings = bookings.filter(b => b.travelPackage);

    res.status(200).json({ success: true, data: agencyBookings });
  } catch (error) {
    console.error("Get agency bookings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

