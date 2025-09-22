import Place from "../models/PlaceModel.js";
import Review from "../models/reviewModel.js";
import axios from "axios";


async function getCoordinatesFromAddress(address) {
  try {
    if (!address) return null;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await axios.get(url);
    if (res.data && res.data.length > 0) {
      return [parseFloat(res.data[0].lon), parseFloat(res.data[0].lat)];
    }
    return null;
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}


async function updatePlaceRating(placeId) {
  const reviews = await Review.find({ placeId });
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
  await Place.findByIdAndUpdate(placeId, { averageRating, reviewCount });
}


export const createPlace = async (req, res) => {
  try {
    const { name, description, address, topAttractions: rawAttractions, thingsToDo: rawThingsToDo, travelStyles: rawTravelStyles } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    
    let travelStyles = [];
    if (rawTravelStyles) {
      try {
        travelStyles = typeof rawTravelStyles === "string" ? JSON.parse(rawTravelStyles) : rawTravelStyles;
      } catch {
        travelStyles = [];
      }
    }

    
    let topAttractions = [];
    if (rawAttractions) {
      try {
        const parsed = typeof rawAttractions === "string" ? JSON.parse(rawAttractions) : rawAttractions;
        if (Array.isArray(parsed)) {
          const attractionImages = req.files?.attractionImages || [];
          topAttractions = parsed.map((item, index) => ({
            name: item.name || "",
            image: attractionImages[index] ? `/uploads/${attractionImages[index].filename}` : "",
          }));
        }
      } catch (err) {
        console.warn(" Invalid topAttractions:", err.message);
      }
    }

    
    let thingsToDo = [];
    if (rawThingsToDo) {
      try {
        const parsed = typeof rawThingsToDo === "string" ? JSON.parse(rawThingsToDo) : rawThingsToDo;
        if (Array.isArray(parsed)) {
          const thingsToDoImages = req.files?.thingsToDoImages || [];
          thingsToDo = parsed.map((item, index) => ({
            title: item.title || "",
            description: item.description || "",
            image: thingsToDoImages[index] ? `/uploads/${thingsToDoImages[index].filename}` : "",
          }));
        }
      } catch (err) {
        console.warn(" Invalid thingsToDo:", err.message);
      }
    }

    
    const images = req.files?.images ? req.files.images.map(f => `/uploads/${f.filename}`) : [];


    const coordinates = await getCoordinatesFromAddress(address);

    const place = new Place({
      name,
      description,
      address,
      travelStyles,
      topAttractions,
      thingsToDo,
      images,
      location: { type: "Point", coordinates: coordinates || [0, 0], address: address || "" },
      averageRating: 0,
      reviewCount: 0,
    });

    await place.save();
    res.status(201).json(place);
  } catch (error) {
    console.error(" CreatePlace Error:", error);
    res.status(500).json({ message: "Error creating place", error: error.message });
  }
};


export const getPlaces = async (req, res) => {
  try {
    
    const { travelStyle } = req.query;

    const query = travelStyle ? { travelStyles: { $in: [travelStyle] } } : {};
    const places = await Place.find(query);
    res.json(places);
  } catch (error) {
    console.error(" GetPlaces Error:", error);
    res.status(500).json({ message: "Error fetching places", error: error.message });
  }
};


export const getRecommendedPlaces = async (req, res) => {
  try {
    const { travelStyle, limit = 5 } = req.query;
    const query = travelStyle ? { travelStyles: { $in: [travelStyle] } } : {};
    const places = await Place.find(query).sort({ averageRating: -1, reviewCount: -1 }).limit(parseInt(limit));
    res.json(places);
  } catch (error) {
    console.error(" GetRecommendedPlaces Error:", error);
    res.status(500).json({ message: "Error fetching recommended places", error: error.message });
  }
};


export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

 
    const reviews = await Review.find({ placeId: place._id }).populate("user", "name");
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

    
    const recommended = await Place.find({
      _id: { $ne: place._id },
      travelStyles: { $in: place.travelStyles },
    }).sort({ averageRating: -1 }).limit(5);

   
    const lat = place.location?.coordinates?.[1] || 0;
    const lng = place.location?.coordinates?.[0] || 0;

    
    const placeData = {
      ...place.toObject(),
      reviews,
      reviewCount,
      averageRating,
      recommended,
      lat,
      lng,
    };

    res.json(placeData);
  } catch (error) {
    console.error(" GetPlaceById Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updatePlace = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;

   
    if (req.body.travelStyles) {
      try {
        updateData.travelStyles = typeof req.body.travelStyles === "string" ? JSON.parse(req.body.travelStyles) : req.body.travelStyles;
      } catch {
        updateData.travelStyles = [];
      }
    }

  
    if (req.body.address) {
      const coords = await getCoordinatesFromAddress(req.body.address);
      updateData.location = { type: "Point", coordinates: coords || [0, 0], address: req.body.address };
    }

  
    if (req.files?.images) updateData.images = req.files.images.map(f => `/uploads/${f.filename}`);

   
    if (req.body.topAttractions) {
      try {
        const parsed = typeof req.body.topAttractions === "string" ? JSON.parse(req.body.topAttractions) : req.body.topAttractions;
        const attractionImages = req.files?.attractionImages || [];
        updateData.topAttractions = parsed.map((item, index) => ({
          name: item.name || "",
          image: attractionImages[index] ? `/uploads/${attractionImages[index].filename}` : item.existingImage || "",
        }));
      } catch {}
    }

    
    if (req.body.thingsToDo) {
      try {
        const parsed = typeof req.body.thingsToDo === "string" ? JSON.parse(req.body.thingsToDo) : req.body.thingsToDo;
        const thingsToDoImages = req.files?.thingsToDoImages || [];
        updateData.thingsToDo = parsed.map((item, index) => ({
          title: item.title || "",
          description: item.description || "",
          image: thingsToDoImages[index] ? `/uploads/${thingsToDoImages[index].filename}` : item.existingImage || "",
        }));
      } catch {}
    }

    const place = await Place.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!place) return res.status(404).json({ message: "Place not found" });

    res.json(place);
  } catch (error) {
    console.error(" UpdatePlace Error:", error);
    res.status(500).json({ message: "Error updating place", error: error.message });
  }
};


export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    await Review.deleteMany({ placeId: req.params.id });
    res.json({ message: "Place and related reviews deleted successfully" });
  } catch (error) {
    console.error("DeletePlace Error:", error);
    res.status(500).json({ message: "Error deleting place", error: error.message });
  }
};


export const getNearbyPlaces = async (req, res) => {
  try {
    const { lng, lat, distance = 5000 } = req.query;
    if (!lng || !lat) return res.status(400).json({ message: "Longitude and latitude are required" });

    const places = await Place.find({
      location: { $near: { $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] }, $maxDistance: parseInt(distance) } },
    });

    res.json(places);
  } catch (error) {
    console.error("NearbyPlaces Error:", error);
    res.status(500).json({ message: "Error fetching nearby places", error: error.message });
  }
};


export const getWeatherForPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    const [lng, lat] = place.location.coordinates;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    res.json({
      temperature: response.data.main.temp,
      condition: response.data.weather[0].description,
      city: response.data.name,
    });
  } catch (error) {
    console.error(" Weather Error:", error);
    res.status(500).json({ message: "Error fetching weather", error: error.message });
  }
};


export const searchPlaces = async (req, res) => {
  try {
    const { query } = req.params;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const places = await Place.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json(places);
  } catch (error) {
    console.error(" SearchPlaces Error:", error);
    res.status(500).json({ message: "Error searching places", error: error.message });
  }
};


export const getTopRatedPlaces = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const places = await Place.find({})
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    const updatedPlaces = places.map((p) => ({
      ...p._doc,
      images: p.images?.map((img) =>
        img.startsWith("http") ? img : `${req.protocol}://${req.get("host")}${img}`
      ) || [],
    }));

    res.json({ success: true, places: updatedPlaces });
  } catch (error) {
    console.error(" GetTopRatedPlaces Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching top-rated places",
      error: error.message,
    });
  }
};
