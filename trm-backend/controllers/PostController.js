import Post from "../models/PostModel.js";

// =========================
// Create a new post
// =========================
export const createPost = async (req, res) => {
  try {
    console.log("=== CREATE POST ===");
    console.log("Request body:", req.body);
    console.log("Logged-in user:", req.user);

    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const post = await Post.create({
      content,
      image,
      author: req.user._id,
    });

    console.log("Saved post:", post);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error("CREATE POST ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Get all posts
// =========================
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    console.log("Fetched posts:", posts);
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("GET ALL POSTS ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Get a single post by ID
// =========================
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name")
      .populate("comments.user", "name");

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    console.log("Fetched post:", post);
    res.json({ success: true, data: post });
  } catch (error) {
    console.error("GET POST BY ID ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Update a post
// =========================
export const updatePost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    post.content = content || post.content;
    post.image = image || post.image;

    const updatedPost = await post.save();
    console.log("Updated post:", updatedPost);

    res.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("UPDATE POST ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Delete a post
// =========================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await post.deleteOne();
    console.log("Deleted post:", post);

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE POST ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Add comment to a post
// =========================
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({ user: req.user._id, text });
    await post.save();
    await post.populate("comments.user", "name");

    console.log("Added comment:", post.comments[post.comments.length - 1]);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Like/unlike a post
// =========================
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const userId = req.user._id.toString();
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    console.log("Toggled like for post:", post);

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("TOGGLE LIKE POST ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Like/unlike a comment
// =========================
export const toggleLikeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const userId = req.user._id.toString();
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await post.save();
    await post.populate("comments.user", "name");

    console.log("Toggled like for comment:", comment);
    res.json({ success: true, data: post });
  } catch (error) {
    console.error("TOGGLE LIKE COMMENT ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

