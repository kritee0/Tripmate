import express from "express";
import Booking from "../models/BookingModel/BookModel.js";

const esewaRouter = express.Router();

/**
 * eSewa payment success callback
 * eSewa sends GET request with base64-encoded transaction data
 */
esewaRouter.get("/success", async (req, res) => {
  try {
    const data = req.query;

    if (!data.data) {
      return res.redirect("http://localhost:5173/esewa/failure");
    }

    // Decode base64 eSewa payload
    const transactionData = JSON.parse(
      Buffer.from(data.data, "base64").toString("utf-8")
    );

    const bookingId = transactionData.transaction_uuid;

    // Update booking status to 'paid'
    const bookingDetails = await Booking.findOneAndUpdate(
      { bookingId },
      { status: "paid" },
      { new: true }
    );

    if (!bookingDetails) {
      return res.redirect("http://localhost:5173/esewa/failure");
    }

    // Redirect to frontend success page with bookingId
    return res.redirect(
      `http://localhost:5173/esewa/success?bookingId=${bookingId}`
    );
  } catch (err) {
    console.error("Esewa success error:", err);
    return res.redirect("http://localhost:5173/esewa/failure");
  }
});

/**
 * eSewa payment failure route
 */
esewaRouter.get("/failure", (req, res) => {
  return res.redirect("http://localhost:5173/esewa/failure");
});

export default esewaRouter;

