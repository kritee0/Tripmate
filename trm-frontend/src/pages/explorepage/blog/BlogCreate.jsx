// BlogCreate.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import BlogPreview from "./BlogPreview";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/apiUtiles";
import { ArrowLeft } from "lucide-react";

const BlogCreate = ({ initialData = null }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [status, setStatus] = useState(initialData?.status || "");
  const [saving, setSaving] = useState(false);

  // Update form when initialData changes (important for edit)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setDescription(initialData.description || "");
      setTags(initialData.tags || []);
      setImageUrl(initialData.imageUrl || "");
      setStatus(initialData.status || "");
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (newStatus) => {
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

      let res;
      if (initialData?._id) {
        // Editing existing blog
        res = await api.patch(`/blogs/${initialData._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        });
      } else {
        // Creating new blog
        res = await api.post("/blogs/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        });
      }

      if (res.data.success) {
        toast.success(
          `Blog ${newStatus === "draft" ? "saved as draft" : "ready for review"}!`
        );
        navigate("/blogs/my-blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

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

      {/* Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none p-1"
        />

        <MDEditor
          value={content}
          onChange={setContent}
          height={300}
          className="border rounded"
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((k) => k.trim()))
          }
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("ready")}
            disabled={saving}
            className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
          >
            Mark Ready
          </button>
        </div>
      </div>

      {/* Preview */}
      <div>
        <BlogPreview
          blog={{ title, content, description, tags, imageUrl, status }}
        />
      </div>
    </div>
  );
};

export default BlogCreate;


