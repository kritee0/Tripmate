import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft } from "lucide-react";
import api from "../../../utils/apiUtiles";
import BlogPreview from "./BlogPreview"
import { useAuth } from "../../../context/AuthContext";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(true);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data.success) {
          const b = res.data.data;

          // ✅ Pre-fill all fields with fetched data
          setTitle(b.title || "");
          setContent(b.content ?? "");
          setDescription(b.description || "");
          setTags(b.tags || []);
          setImageUrl(b.imageUrl || "");
          setStatus(b.status || "draft");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog details");
      } finally {
        setLoadingBlog(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Update blog
  const handleUpdate = async (newStatus) => {
    if (!user) return toast.error("Please login first");
    if (!title.trim()) return toast.error("Title is required");

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags));
      formData.append("status", newStatus);
      if (imageFile) formData.append("image", imageFile);

      const token = localStorage.getItem("token");
      const res = await api.patch(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Blog updated successfully!");
        navigate("/blogs/my-blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingBlog) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Back Button */}
      <div className="col-span-full mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Left side form */}
      <div className="space-y-4">
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none p-1"
        />

        <label className="block mb-1 font-semibold">Content (Markdown)</label>
        <MDEditor
          value={content}
          onChange={setContent}
          height={300}
          className="border rounded"
        />

        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="block mb-1 font-semibold">Tags</label>
        <input
          type="text"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((k) => k.trim()))
          }
          className="w-full p-2 border rounded"
        />

        <label className="block mb-1 font-semibold">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        {/* Show old image if exists */}
        {imageUrl && !imageFile && (
          <img
            src={imageUrl}
            alt="Blog"
            className="w-full h-40 object-cover rounded-lg mt-2"
          />
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleUpdate("draft")}
            disabled={saving}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleUpdate("ready")}
            disabled={saving}
            className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
          >
            Mark Ready
          </button>
        </div>
      </div>

      {/* Right side preview */}
      <div>
        <BlogPreview
          blog={{ title, content, description, tags, imageUrl, status }}
        />
      </div>
    </div>
  );
};

export default BlogEdit;

