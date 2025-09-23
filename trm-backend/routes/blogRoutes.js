import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  publishBlog,
  getUserBlogs, // <-- add this import
} from "../controllers/blogController.js";
import { checkAuthorization } from "../middleware/checkAuthorization.js";
import { upload } from "../middleware/uploadMiddleware.js"; // ✅ correct import

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/my-blogs", checkAuthorization, getUserBlogs);

router.get("/:id", getBlogById);

// Authenticated user routes
router.post("/create", checkAuthorization, upload.single("image"), createBlog);
router.patch("/:id", checkAuthorization,
     upload.single("image"), updateBlog);
router.delete("/:id", checkAuthorization, deleteBlog);

// Route for logged-in user's blogs
router.get("/my-blogs", checkAuthorization, getUserBlogs);

// Admin-only route to publish a blog
router.patch("/publish/:id", checkAuthorization, publishBlog);

export default router;



