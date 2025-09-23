import Blog from "../models/BlogModel.js";
import { UserModel } from "../models/userModels.js";

// -------------------- CREATE BLOG --------------------
export const createBlog = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      author: req.user.id,
      status: "draft", // default
      tags: req.body.tags || [],
    });

    await blog.save();

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error("CreateBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET ALL BLOGS --------------------
export const getAllBlogs = async (req, res) => {
  try {
    // Admin can see all, normal users only published
    const query = req.user?.role === "Admin" ? {} : { status: "published" };

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name");

    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("GetAllBlogs Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET BLOG BY ID --------------------
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Only published blogs visible to normal users
    if (blog.status !== "published" && req.user?.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("GetBlogById Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Only author can update
    if (req.user._id.toString() !== blog.author.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updates = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      description: req.body.description || blog.description,
      tags: req.body.tags || blog.tags,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : blog.imageUrl,
      status: req.body.status || blog.status,
    };

    blog.set(updates);
    await blog.save();

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("UpdateBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- DELETE BLOG --------------------
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (req.user.id !== blog.author.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DeleteBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- PUBLISH BLOG (ADMIN ONLY) --------------------
export const publishBlog = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Only admin can publish" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    blog.status = "published";
    await blog.save();

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("PublishBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET USER BLOGS --------------------
export const getUserBlogs = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate("author", "name role");

    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("GetUserBlogs Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
