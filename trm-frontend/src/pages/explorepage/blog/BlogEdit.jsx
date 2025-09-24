// src/pages/explore/blog/BlogEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/apiUtiles";
import Loader from "../../../components/common/Loader";
import { useAuth } from "../../../context/AuthContext";
import MDEditor from "@uiw/react-md-editor";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      if (!token) return;

      try {
        const res = await api.get(`/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const data = res.data.data;
          setBlog(data);
          setTitle(data.title);
          setDescription(data.description);
          setContent(data.content);
          setImageUrl(data.imageUrl || "");
        } else {
          toast.error("Failed to fetch blog");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch blog");
      } finally {
        setLoadingBlog(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  if (loadingBlog) return <Loader fullscreen={true} />;

  // Handle update
  const handleUpdate = async () => {
    if (!title || !content) return toast.error("Title and content are required");
    setUpdating(true);

    try {
      const res = await api.put(
        `/blogs/${id}`,
        { title, description, content, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Blog updated successfully");
        navigate("/blogs/my-blogs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update blog");
    } finally {
      setUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (blog.status === "published") return toast.error("Cannot delete published blog");

    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Blog deleted successfully");
        navigate("/blogs/my-blogs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="border rounded p-2">
          <MDEditor value={content} onChange={setContent} height={300} />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            {updating ? "Updating..." : "Update Blog"}
          </button>

          {blog.status !== "published" && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
            >
              Delete Blog
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEdit;






