import express from "express";
import {
  getTravelJourney,
  getNotes,
  addNote,
  editNote,
  deleteNote,
  isSavedPlace ,
  savePlace,
  unsavePlace,
  setNextTrip,
  getSavedPlaces,
} from "../controllers/JourneyController.js"

import { checkAuthorization } from "../middleware/checkAuthorization.js";

const router = express.Router();


router.use(checkAuthorization);

router.get("/is-saved/:placeId", isSavedPlace);


router.get("/", getTravelJourney);


router.get("/note", getNotes); 
router.post("/note", addNote);
router.put("/note", editNote);
router.delete("/note", deleteNote);


router.post("/save-place", savePlace);
router.get("/saved-places", getSavedPlaces);
router.delete("/unsave-place", unsavePlace);


router.post("/next-trip", setNextTrip);

export default router;
