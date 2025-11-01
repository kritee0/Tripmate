// controllers/hotelController.js
import Hotel from "../models/HotelModel.js";
import Place from "../models/PlaceModel.js";
import Review from "../models/reviewModel.js";

// ------------------ CREATE HOTEL ------------------
export const createHotel = async (req, res) => {
  try {
    const {
      placeId,
      name,
      description,
      address,
      contact,
      priceRange,
      amenities,
      roomFeatures,
      lat,
      long,
    } = req.body;

    if (!placeId || !name)
      return res.status(400).json({ message: "Place ID and hotel name are required" });

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: "Place not found" });

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const hotel = new Hotel({
      placeId,
      name,
      description,
      image,
      address,
      contact,
      priceRange,
      amenities: amenities ? JSON.parse(amenities) : [],
      roomFeatures: roomFeatures ? JSON.parse(roomFeatures) : [],
      location: {
        type: "Point",
        coordinates:
          lat && long
            ? [parseFloat(long), parseFloat(lat)]
            : [0, 0],
      },
    });

    await hotel.save();

    // Push hotel reference to Place
    place.hotels.push(hotel._id);
    await place.save();

    res.status(201).json(hotel);
  } catch (error) {
    console.error("CreateHotel Error:", error.message);
    res.status(500).json({ message: "Error creating hotel", error: error.message });
  }
};

// ------------------ GET HOTELS BY PLACE WITH REVIEWS ------------------
export const getHotelsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Fetch place with hotels populated
    const place = await Place.findById(placeId).populate("hotels");
    if (!place) return res.status(404).json({ message: "Place not found" });

    // Add reviews & ratings for each hotel
    const hotelsWithReviews = await Promise.all(
      place.hotels.map(async (hotel) => {
        const reviews = await Review.find({ hotelId: hotel._id }).populate("user", "name");
        const reviewCount = reviews.length;
        const averageRating =
          reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

        return {
          ...hotel.toObject(),
          reviews,
          reviewCount,
          averageRating,
        };
      })
    );

    res.json(hotelsWithReviews);
  } catch (error) {
    console.error("GetHotelsByPlace Error:", error.message);
    res.status(500).json({ message: "Error fetching hotels", error: error.message });
  }
};

// ------------------ GET HOTEL BY ID WITH REVIEWS ------------------
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("placeId", "name");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const reviews = await Review.find({ hotelId: hotel._id }).populate("user", "name");
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

    res.json({ ...hotel.toObject(), reviews, reviewCount, averageRating });
  } catch (error) {
    console.error("GetHotelById Error:", error.message);
    res.status(500).json({ message: "Error fetching hotel", error: error.message });
  }
};

// ------------------ UPDATE HOTEL ------------------
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = req.body;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const location = JSON.parse(updateData.location)
    const amenities = JSON.parse(updateData.amenities)
    const roomFeatures = JSON.parse(updateData.roomFeatures)

    const newData = { ...updateData, location, amenities, roomFeatures }
    console.log(newData)

    const hotel = await Hotel.findByIdAndUpdate(id, newData, { new: true });


    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error updating hotel", error: error.message });
  }
};

// ------------------ DELETE HOTEL ------------------
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Remove reference from Place
    await Place.updateOne({ hotels: id }, { $pull: { hotels: id } });

    await Review.deleteMany({ hotelId: id });

    res.json({ message: "Hotel and related reviews deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel", error: error.message });
  }
};

// ------------------ GET ALL HOTELS WITH REVIEWS ------------------
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("placeId", "name");

    const hotelsWithReviews = await Promise.all(
      hotels.map(async (hotel) => {
        const reviews = await Review.find({ hotelId: hotel._id }).populate("user", "name");
        const reviewCount = reviews.length;
        const averageRating =
          reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

        return {
          ...hotel.toObject(),
          reviews,
          reviewCount,
          averageRating,
        };
      })
    );

    res.json(hotelsWithReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// controllers/hotelController.js
export const recommendHotels = async (req, res) => {
  try {
    const { lat, lon, radius = 10000 } = req.body;

    if (lat == null || lon == null)
      return res.status(400).json({ message: "Latitude and longitude are required" });

    // $near query without extra conditions on the same field
    const nearbyHotels = await Hotel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    }).lean();

    // Filter out hotels that still have invalid coordinates
    const validHotels = nearbyHotels.filter(
      (hotel) => hotel.location?.coordinates?.[0] !== 0 || hotel.location?.coordinates?.[1] !== 0
    );

    if (!validHotels.length) {
      return res.status(404).json({ message: "No nearby hotels found" });
    }

    const hotelsWithPhoto = validHotels.map((hotel) => ({
      ...hotel,
      photo: hotel.image || "https://via.placeholder.com/300",
    }));

    res.status(200).json({ hotels: hotelsWithPhoto });
  } catch (err) {
    console.error("RecommendHotels Error:", err.message);
    res.status(500).json({
      message: "Error recommending hotels",
      error: err.message,
    });
  }
};
