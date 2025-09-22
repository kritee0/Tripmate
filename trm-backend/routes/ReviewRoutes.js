import express from "express";
import { getReviews, addReview, updateReview, deleteReview } from "../controllers/reviewController.js";
import { checkAuthorization } from "../middleware/checkAuthorization.js";

const router = express.Router();


router.get("/:placeId", getReviews);


router.post("/", checkAuthorization, addReview);

router.patch("/:id", checkAuthorization, updateReview);


router.delete("/:id", checkAuthorization, deleteReview);

export default router;

