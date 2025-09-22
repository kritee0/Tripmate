
import express from "express";
import Place from "../models/PlaceModel.js";
import Review from "../models/reviewModel.js";

const router = express.Router();


router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;

    
    const places = await Place.find({ name: { $regex: query, $options: "i" } });

    if (!places.length) {
      return res.status(404).json({ message: "No places found" });
    }

 
    const results = await Promise.all(
      places.map(async (place) => {
        const reviews = await Review.find({ placeId: place._id });
        return { place, reviews };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching place info", error });
  }
});

export default router;
