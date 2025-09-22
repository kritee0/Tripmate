import express from "express";
import { trackInterest, getRecommendations } from "../controllers/InterestController.js"
import { checkAuthorization } from "../middleware/checkAuthorization.js";

const router = express.Router();
router.post("/track", checkAuthorization, trackInterest);
router.get("/recommendations", checkAuthorization, getRecommendations);

export default router;
