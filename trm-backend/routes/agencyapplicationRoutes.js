import express from "express";
import {
  createAgency,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  changeAgencyStatus,
  getPendingApplications,
} from "../controllers/AgencyController.js";

import {
  checkAuthorization,
  checkTravelAgencyOrAdmin,
  checkAdminOnly,
} from "../middleware/checkAuthorization.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();


router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});


router.post("/", checkAuthorization, upload.array("documents", 5), createAgency);


router.get("/", checkAuthorization, checkAdminOnly, getApplications);
router.get("/pending", checkAuthorization, checkAdminOnly, getPendingApplications);
router.get("/:id", checkAuthorization, getApplicationById);


router.put(
  "/:id",
  checkAuthorization,
  checkTravelAgencyOrAdmin,
  upload.array("documents", 5),
  updateApplication
);
router.patch("/:id/status", checkAuthorization, checkAdminOnly, changeAgencyStatus);


router.delete("/:id", checkAuthorization, checkTravelAgencyOrAdmin, deleteApplication);

export default router;
