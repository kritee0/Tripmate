import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  toggleLikePost,
  toggleLikeComment,
} from "../controllers/PostController.js"
import { checkAuthorization } from "../middleware/checkAuthorization.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);           // Get all posts
router.get("/:id", getPostById);        // Get a single post by ID

// Protected routes (all logged-in users)
router.post("/", checkAuthorization, createPost);                   // Create post
router.put("/:id", checkAuthorization, updatePost);                // Update post (author checked inside controller)
router.delete("/:id", checkAuthorization, deletePost);             // Delete post (author checked inside controller)
router.post("/:id/comment", checkAuthorization, addComment);       // Add comment
router.post("/:id/like", checkAuthorization, toggleLikePost);      // Like/unlike post
router.post("/:postId/comment/:commentId/like", checkAuthorization, toggleLikeComment); // Like/unlike comment

export default router;
