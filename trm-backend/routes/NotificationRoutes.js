import express from "express";
import { checkAuthorization } from "../middleware/checkAuthorization.js";
import {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
  createNotification,  
} from "../controllers/NotificationController.js";

const router = express.Router();


router.post("/", checkAuthorization, createNotification);


router.get("/", checkAuthorization, getUserNotifications);


router.patch("/:id/read", checkAuthorization, markNotificationRead);


router.delete("/:id", checkAuthorization, deleteNotification);

export default router;
