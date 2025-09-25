import express from "express";
import Booking from "./../models/BookingModel/BookModel.js";

const esewaRouter = express.Router();

esewaRouter.get("/success/", async (req, res) => {
  try {
    const data = req.query;

    // decode the Esewa payload
    const transationData = JSON.parse(
      Buffer.from(data.data, "base64").toString("utf-8")
    );

    const bookingId = transationData.transaction_uuid;

    // ✅ update status to paid
    const bookingDetails = await Booking.findOneAndUpdate(
      { bookingId },
      { status: "paid" },
      { new: true } // return updated doc
    );

    if (!bookingDetails) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }


    // TODO : redirect to payment success page in frontend.
    res.json({
      success: true,
      message: "Payment successful, booking updated to paid",
      data: bookingDetails,
    });
  } catch (err) {
    console.error("Esewa success error:", err);
    res.status(500).json({ success: false, message: "Failed to update booking" });
  }
});

export default esewaRouter;
