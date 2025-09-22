import express from "express";
import { getDashboardStats } from "../controllers/DashboardController.js";
import { checkAuthorization } from "../middleware/checkAuthorization.js";

const router = express.Router();

router.get("/stats", checkAuthorization, getDashboardStats);

export default router;
