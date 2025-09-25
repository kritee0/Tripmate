import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  publishBlog,
  getUserBlogs,
  getReadyBlogs // <-- add this import
} from "../controllers/BlogController.js"
import { checkAuthorization } from "../middleware/checkAuthorization.js";
import { upload } from "../middleware/uploadMiddleware.js"; // ✅ correct import

const router = express.Router();

// Public routes
router.get("/", checkAuthorization, getAllBlogs);
router.get("/my-blogs", checkAuthorization, getUserBlogs);
router.get("/ready", checkAuthorization, getReadyBlogs);


router.get("/:id",checkAuthorization,  getBlogById);

// Authenticated user routes
router.post("/create", checkAuthorization, upload.single("image"), createBlog);
router.patch("/:id", checkAuthorization,
     upload.single("image"), updateBlog);
router.delete("/:id", checkAuthorization, deleteBlog);

// Route for logged-in user's blogs
router.get("/my-blogs", checkAuthorization, getUserBlogs);

// Admin-only route to publish a blog
router.patch("/publish/:id", checkAuthorization, publishBlog);
// Admin-only route to fetch ready blogs
router.get("/ready", checkAuthorization, getReadyBlogs);


export default router;



