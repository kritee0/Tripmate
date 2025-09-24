import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import reviewRoutes from "./routes/ReviewRoutes.js";  
import placeRoutes from "./routes/placeRoutes.js"
import bookingRoutes from "./routes/BookRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import  notificationRoutes from "./routes/NotificationRoutes.js"
import agencyapplicationRoutes from "./routes/agencyapplicationRoutes.js"
import travelInterestRoutes from "./routes/interestRoutes.js";
import travelJourneyRoutes from "./routes/journeyRoutes.js"
import blogRoutes from "./routes/blogRoutes.js";
import recommendationRoutes from "./routes/RecommendationRoutes.js"
import postRoutes from "./routes/PostRoutes.js"



dotenv.config();
const app = express();
const port = 4000;
const apiKey = process.env.OPENWEATHER_API_KEY;

connectToDB();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "This is test router" });
});


app.use("/api/auth", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/reviews", reviewRoutes); 
app.use("/api/places", placeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/agency-applications", agencyapplicationRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/interests", travelInterestRoutes);
app.use("/api/journey", travelJourneyRoutes);
app.use("/api/blogs", blogRoutes);

app.use("/api/posts", postRoutes);  






app.use("/api/admin/recommendations", recommendationRoutes);





// Optional test for singular review route
app.get("/api/review", (req, res) => {
  res.json({ success: true, message: "This is review router" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
