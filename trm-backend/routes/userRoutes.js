import express from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  updatePassword,
  getMyProfile,
  createAdmin,
  recordTravelClick,      
  getRecommendedStyle ,getUserStats ,getAllUsers    
} from "../controllers/userControllers.js";
import {
  checkAuthorization,
  checkAdminOnly,
} from "../middleware/checkAuthorization.js";

const router = express.Router();
router.get("/stats/overview", checkAuthorization, checkAdminOnly, getUserStats);


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-admin", createAdmin);


router.get("/profile", checkAuthorization, getMyProfile);
router.put("/:userId", checkAuthorization, updateUser);
router.patch("/:userId/password", checkAuthorization, updatePassword);
router.delete("/:userId", checkAuthorization, checkAdminOnly, deleteUser);


router.post("/travel/click", checkAuthorization, recordTravelClick);      
router.get("/travel/recommendation", checkAuthorization, getRecommendedStyle); 
router.get("/", checkAuthorization, checkAdminOnly, getAllUsers);

export default router;
