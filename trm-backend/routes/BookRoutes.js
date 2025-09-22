import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getAgencyBookings,
  cancelBooking,
  updateBookingStatusByAgency
} from "../controllers/BookController/BookController.js";

import { checkAuthorization, checkLoggedInUser } from "../middleware/checkAuthorization.js";

const router = express.Router();

// ✅ Create a new booking (only logged-in users)
router.post("/", checkAuthorization, checkLoggedInUser, createBooking);

// ✅ Get all bookings (only admin)
router.get("/", checkAuthorization, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admin can view all bookings" });
  }
  next();
}, getAllBookings);

// ✅ Get user bookings (only logged-in user)
router.get("/my-bookings", checkAuthorization, checkLoggedInUser, getUserBookings);

// ✅ Get agency bookings (only agency)
router.get("/agency", checkAuthorization, checkLoggedInUser, (req, res, next) => {
  if (req.user.role !== "agency") {
    return res.status(403).json({ success: false, message: "Only agencies can view their bookings" });
  }
  next();
}, getAgencyBookings);

// ✅ Cancel booking (user, agency for own package, or admin)
router.put("/:id/cancel", checkAuthorization, checkLoggedInUser, cancelBooking);

// ✅ Update booking status by agency (confirm / cancel)
router.put("/:bookingId/status", checkAuthorization, checkLoggedInUser, (req, res, next) => {
  if (req.user.role !== "agency") {
    return res.status(403).json({ success: false, message: "Only agencies can update booking status" });
  }
  next();
}, updateBookingStatusByAgency);

export default router;



