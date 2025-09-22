// routes/blogRoutes.js
import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  approveBlog,
} from "../controllers/blogController.js";
import { checkAuthorization } from "../middleware/checkAuthorization.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Authenticated user routes
router.post("/", checkAuthorization, createBlog);
router.patch("/:id", checkAuthorization, updateBlog);
router.delete("/:id", checkAuthorization, deleteBlog);

// Admin-only route for approving a blog
router.patch("/approve/:id", checkAuthorization, approveBlog);

export default router;


