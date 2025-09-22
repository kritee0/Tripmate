import Blog from "../models/blogModel.js";
import Notification from "../models/NotificcationModel.js"
import { UserModel } from "../models/userModels.js"

// Helper: parse JSON safely
const parseJSONField = (field) => {
  if (!field) return undefined;
  try {
    return typeof field === "string" ? JSON.parse(field) : field;
  } catch (err) {
    console.error("Failed to parse JSON field:", field, err);
    return undefined;
  }
};

// -------------------- CREATE BLOG --------------------
export const createBlog = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Blog image is required" });
    }

    const blog = new Blog({
      title: req.body.title,
      body: req.body.body,
      conclusion: req.body.conclusion,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
      status: "pending",
    });

    await blog.save();

    // Notify admins
    const admins = await UserModel.find({ role: "Admin" });
    const notifications = admins.map(admin => ({
      title: "New Blog Submitted",
      message: `${req.user.name} submitted a new blog titled "${blog.title}" awaiting approval.`,
      user: admin._id,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error("CreateBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET ALL BLOGS --------------------
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name role");
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    console.error("GetAllBlogs Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- GET BLOG BY ID --------------------
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy", "name role");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("GetBlogById Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- UPDATE BLOG --------------------
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (!req.user || req.user.id !== blog.createdBy.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const body = { ...req.body };
    if (req.file) body.image = `/uploads/${req.file.filename}`;

    // If blog was approved, set status back to pending
    const statusChanged = blog.status === "approved";
    blog.set({ ...body, status: statusChanged ? "pending" : blog.status });
    await blog.save();

    // Notify admins if blog was approved before
    if (statusChanged) {
      const admins = await UserModel.find({ role: "Admin" });
      const notifications = admins.map(admin => ({
        title: "Blog Updated",
        message: `${req.user.name} updated the approved blog "${blog.title}". Re-approval is required.`,
        user: admin._id,
      }));
      await Notification.insertMany(notifications);
    }

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

    if (!req.user || (req.user.id !== blog.createdBy.toString() && req.user.role !== "Admin")) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DeleteBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- APPROVE BLOG --------------------
export const approveBlog = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Only admin can approve blogs" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    blog.status = "approved";
    await blog.save();

    // Notify the user
    await Notification.create({
      title: "Blog Approved",
      message: `Your blog "${blog.title}" has been approved by admin.`,
      user: blog.createdBy,
    });

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error("ApproveBlog Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
