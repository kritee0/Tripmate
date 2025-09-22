import { TravelJourney } from "../models/JourneyModel.js";

import Place from "../models/PlaceModel.js";
import Notification from "../models/NotificcationModel.js";
import { UserModel } from "../models/userModels.js";

export const getTravelJourney = async (req, res) => {
  try {
    const journey = await TravelJourney.findOne({ userId: req.user.id })
      .populate("savedPlaces.placeId")
      .populate("nextTrip.placeId")
      .populate("nextTrip.packageSuggestions.packageId");

    if (!journey) {
      return res.json({
        success: true,
        journey: {
          userId: req.user.id,
          notes: [],
          savedPlaces: [],
          nextTrip: null,
        },
      });
    }

    res.json({ success: true, journey });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getNotes = async (req, res) => {
  try {
    const journey = await TravelJourney.findOne({ userId: req.user.id });

    if (!journey) {
      return res.json({ success: true, notes: [] });
    }

    res.json({ success: true, notes: journey.notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    let journey = await TravelJourney.findOne({ userId: req.user.id });

    if (!journey) journey = new TravelJourney({ userId: req.user.id });

    journey.notes.push({ title, content });
    await journey.save();

    res.json({ success: true, notes: journey.notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const editNote = async (req, res) => {
  try {
    const { noteId, title, content } = req.body;
    const journey = await TravelJourney.findOne({ userId: req.user.id });
    if (!journey)
      return res
        .status(404)
        .json({ success: false, message: "Journey not found" });

    const note = journey.notes.id(noteId);
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });

    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = new Date();

    await journey.save();
    res.json({ success: true, notes: journey.notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const journey = await TravelJourney.findOne({ userId: req.user.id });
    if (!journey)
      return res
        .status(404)
        .json({ success: false, message: "Journey not found" });

    journey.notes = journey.notes.filter((n) => n._id.toString() !== noteId);
    await journey.save();

    res.json({ success: true, notes: journey.notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const isSavedPlace = async (req, res) => {
  try {
    const userId = req.user.id;
    const placeId = req.params.placeId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.savedPlaces.includes(placeId);

    return res.json({ isSaved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSavedPlaces = async (req, res) => {
  try {
    const journey = await TravelJourney.findOne({ userId: req.user.id })
      .populate({
        path: "savedPlaces.placeId",
        model: "Place", 
      })
      .exec();

    if (!journey) {
      return res.json({ success: true, savedPlaces: [] });
    }
    res.json({ success: true, savedPlaces: journey.savedPlaces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const savePlace = async (req, res) => {
  try {
    const { placeId } = req.body;
    let journey = await TravelJourney.findOne({ userId: req.user.id });
    if (!journey) journey = new TravelJourney({ userId: req.user.id });

    // Prevent duplicate
    if (journey.savedPlaces.some((p) => p.placeId.toString() === placeId)) {
      return res.json({ success: false, message: "Place already saved" });
    }

    journey.savedPlaces.push({ placeId });
    await journey.save();

    res.json({ success: true, savedPlaces: journey.savedPlaces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unsavePlace = async (req, res) => {
  try {
    const { placeId } = req.body;
    const journey = await TravelJourney.findOne({ userId: req.user.id });
    if (!journey)
      return res
        .status(404)
        .json({ success: false, message: "Journey not found" });

    journey.savedPlaces = journey.savedPlaces.filter(
      (p) => p.placeId.toString() !== placeId
    );

    await journey.save();

    res.json({ success: true, savedPlaces: journey.savedPlaces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSeasonFromMonth = (month) => {
  if ([12, 1, 2].includes(month)) return "Winter";
  if ([3, 4, 5].includes(month)) return "Spring";
  if ([6, 7, 8].includes(month)) return "Summer";
  return "Autumn";
};

const getMonthsBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];
  let current = new Date(start);

  while (current <= end) {
    months.push(current.getMonth() + 1);
    current.setMonth(current.getMonth() + 1);
  }

  return [...new Set(months)];
};

export const setNextTrip = async (req, res) => {
  try {
    const {
      placeId,
      startDate,
      endDate,
      checklist = [],
      reminderDate,
    } = req.body;

    let journey = await TravelJourney.findOne({ userId: req.user.id });
    if (!journey) journey = new TravelJourney({ userId: req.user.id });

    const months = getMonthsBetween(startDate, endDate);

    const seasonPacking = {
      Winter: ["Warm jacket", "Gloves", "Thermal wear", "Boots"],
      Spring: ["Light jacket", "Sneakers", "Umbrella"],
      Summer: ["Sunscreen", "Sunglasses", "Hat", "Light clothes"],
      Autumn: ["Jacket", "Scarf", "Comfortable shoes"],
    };

    const packingSuggestions = [];
    const addedItems = new Set();
    months.forEach((month) => {
      const season = getSeasonFromMonth(month);
      (seasonPacking[season] || []).forEach((item) => {
        if (!addedItems.has(item)) {
          addedItems.add(item);
          packingSuggestions.push({ item, completed: false });
        }
      });
    });

    const userChecklist = checklist.map((item) =>
      typeof item === "string" ? { item, completed: false } : item
    );

    const today = new Date();
    const start = new Date(startDate);
    const daysLeft = Math.ceil((start - today) / (1000 * 60 * 60 * 24));

    journey.nextTrip = {
      placeId,
      startDate,
      endDate,
      checklist: userChecklist,
      reminderDate,
      packingSuggestions,
    };
    await journey.save();

    const place = await Place.findById(placeId);
    const placeName = place ? place.name : "your destination";

    const notif = new Notification({
      user: req.user.id,
      message: ` Reminder: Only ${daysLeft} days left until your trip to ${placeName}!`,
      type: "trip-reminder",
      reminderDate: reminderDate || start,
      place: placeId,
      journey: journey._id,
      link: `/trips/${journey._id}`,
      isRead: false,
    });
    await notif.save();

    res.json({ success: true, nextTrip: journey.nextTrip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
