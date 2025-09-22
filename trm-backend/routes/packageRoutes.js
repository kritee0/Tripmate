import express from "express";
import {
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
} from "../controllers/travelPackageControllers.js";

import {
  getBookingsForAgency,
  updateBookingStatus,
} from "../controllers/AgencyController.js";

import { checkAuthorization, checkTravelAgencyOrAdmin, checkTravelAgency } from "../middleware/checkAuthorization.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// -------------------- PACKAGE ROUTES -------------------- //

// Get all travel packages (public)
router.get("/", getAllPackages);

// Create a new travel package (TravelAgency or Admin only)
router.post(
  "/",
  checkAuthorization,
  checkTravelAgencyOrAdmin,
  upload.single("image"),  // handle image upload
  createPackage
);

// Update a travel package by ID
router.put(
  "/:id",
  checkAuthorization,
  checkTravelAgencyOrAdmin,
  upload.single("image"),
  updatePackage
);

// Delete a travel package by ID
router.delete(
  "/:id",
  checkAuthorization,
  checkTravelAgencyOrAdmin,
  deletePackage
);

// -------------------- AGENCY BOOKINGS ROUTES -------------------- //

// Get all bookings for the agency
router.get(
  "/bookings",
  checkAuthorization,
  checkTravelAgency,
  getBookingsForAgency
);

// Confirm a booking
router.post(
  "/bookings/:bookingId/confirm",
  checkAuthorization,
  checkTravelAgency,
  (req, res) => {
    req.body.status = "Confirmed";
    updateBookingStatus(req, res);
  }
);

// Cancel a booking
router.post(
  "/bookings/:bookingId/cancel",
  checkAuthorization,
  checkTravelAgency,
  (req, res) => {
    req.body.status = "Cancelled";
    updateBookingStatus(req, res);
  }
);

export default router;

