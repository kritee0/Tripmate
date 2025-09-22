import TravelPackage from "../models/travelpackage.js";
import { UserModel } from "../models/userModels.js";

// Helper: parse JSON safely
const parseJSONField = (field) => {
  if (!field) return undefined;
  try {
    return typeof field === "string" ? JSON.parse(field) : field;
  } catch (err) {
    console.error("Failed to parse JSON field:", field, err);
    return undefined;
  }
};

// -------------------- CREATE PACKAGE --------------------
export const createPackage = async (req, res) => {
  try {
    const body = { ...req.body };

    // Parse nested JSON fields
    const itinerary = parseJSONField(body.itinerary) || [];
    const policy = parseJSONField(body.policy) || [];
    const highlights = parseJSONField(body.highlights) || [];

    // Handle image upload
    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ success: false, message: "Package image is required" });
    }

    // Handle agency from logged-in user
    let agencyId = null;
    if (req.user && req.user.id) {
      const user = await UserModel.findById(req.user.id);
      if (user?.role === "TravelAgency") {
        agencyId = user._id; // Assuming agency user _id is saved in Agency model
        body.createdBy = req.user.id;
      } else {
        return res.status(403).json({ success: false, message: "Only travel agencies can create packages" });
      }
    }

    const travelPackage = new TravelPackage({
      name: body.name,
      location: body.location,
      image: body.image,
      price: body.price,
      duration: body.duration,
      overview: body.overview,
      highlights,
      category: body.category,
      bestSeason: body.bestSeason,
      transportAvailableOnArrival: body.transportAvailableOnArrival === "true" || body.transportAvailableOnArrival === true,
      itinerary,
      policy,
      agency: agencyId,
      createdBy: body.createdBy,
    });

    await travelPackage.save();

    res.status(201).json({ success: true, data: travelPackage });
  } catch (err) {
    console.error("CreatePackage Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET ALL PACKAGES --------------------
export const getAllPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find()
      .sort({ createdAt: -1 })
      .populate("agency", "name location"); // populate agency info
    res.status(200).json({ success: true, data: packages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET PACKAGE BY ID --------------------
export const getPackageById = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findById(req.params.id).populate("agency", "name location");
    if (!travelPackage) return res.status(404).json({ success: false, message: "Package not found" });

    res.json({ success: true, data: travelPackage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- UPDATE PACKAGE --------------------
export const updatePackage = async (req, res) => {
  try {
    const body = { ...req.body };

    const itinerary = parseJSONField(body.itinerary);
    const policy = parseJSONField(body.policy);
    const highlights = parseJSONField(body.highlights);

    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    }

    const updated = await TravelPackage.findByIdAndUpdate(
      req.params.id,
      { ...body, itinerary, policy, highlights },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Package not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("UpdatePackage Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- DELETE PACKAGE --------------------
export const deletePackage = async (req, res) => {
  try {
    const deleted = await TravelPackage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Package not found" });

    res.json({ success: true, message: `${deleted.name} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- HANDLE BOOKING CREATED --------------------
export const handleBookingCreated = async (packageId) => {
  const travelPackage = await TravelPackage.findById(packageId);
  if (!travelPackage) return;

  travelPackage.bookingsCount = (travelPackage.bookingsCount || 0) + 1;
  const maxRating = 5;
  travelPackage.rating = parseFloat(Math.min(maxRating, 1 + travelPackage.bookingsCount / 10).toFixed(1));

  await travelPackage.save();
};


