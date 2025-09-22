
import express from "express";
import {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  getWeatherForPlace,
  getNearbyPlaces,
  searchPlaces,
  getTopRatedPlaces, 
} from "../controllers/PlaceController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { checkAuthorization, checkAdminOnly } from "../middleware/checkAuthorization.js";

const router = express.Router();




router.get("/", getPlaces);


router.get("/travelStyle/:style", (req, res) => {





  
  req.query.travelStyle = req.params.style;


  getPlaces(req, res);
});


router.get("/search/:query", searchPlaces);


router.get("/nearby/search", getNearbyPlaces);


router.get("/:id/weather", getWeatherForPlace);


router.get("/:id", getPlaceById);


router.get("/featured/top-rated", getTopRatedPlaces); 

router.post(
  "/",
  checkAuthorization,
  checkAdminOnly,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "attractionImages", maxCount: 10 },
    { name: "thingsToDoImages", maxCount: 10 },
  ]),
  createPlace
);

router.put(
  "/:id",
  checkAuthorization,
  checkAdminOnly,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "attractionImages", maxCount: 10 },
    { name: "thingsToDoImages", maxCount: 10 },
  ]),
  updatePlace
);

router.delete("/:id", checkAuthorization, checkAdminOnly, deletePlace);

export default router;
