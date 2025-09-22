import express from "express";
import {
  getAgencies,
  changeAgencyStatus,
  getBookingsForAgency,
  updateBookingStatus,
} from "../controllers/AgencyController.js";
import { checkAuthorization, checkAdminOnly,checkTravelAgencyOrAdmin as checkTravelAgency  } from "../middleware/checkAuthorization.js";

const router = express.Router();


router.get("/", checkAuthorization, checkAdminOnly, getAgencies);

router.put("/:id/status", checkAuthorization, checkAdminOnly, changeAgencyStatus);

router.post("/:id/approve", checkAuthorization, checkAdminOnly, (req, res, next) => {
  req.body.status = "Approved";
  changeAgencyStatus(req, res, next);
});

router.post("/:id/reject", checkAuthorization, checkAdminOnly, (req, res, next) => {
  req.body.status = "Rejected";
  changeAgencyStatus(req, res, next);
});


router.get("/bookings", checkAuthorization, checkTravelAgency, getBookingsForAgency);

router.put("/bookings/:bookingId", checkAuthorization, checkTravelAgency, updateBookingStatus);


router.patch("/bookings/:bookingId/confirm", checkAuthorization,checkTravelAgency, (req, res) => {
  req.body.status = "Confirmed";
  updateBookingStatus(req, res);
});


router.patch("/bookings/:bookingId/cancel", checkAuthorization, checkTravelAgency, (req, res) => {
  req.body.status = "Cancelled";
  updateBookingStatus(req, res);
});

export default router;

