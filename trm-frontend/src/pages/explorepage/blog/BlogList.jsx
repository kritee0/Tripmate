import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/apiUtiles";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const MyBlogs = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch user's blogs
  useEffect(() => {
    if (!user) return;

    const fetchMyBlogs = async () => {
      try {
        const res = await api.get("/blogs/my-blogs");
        if (res.data.success) setBlogs(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch your blogs");
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchMyBlogs();
  }, [user]);

  // Edit blog
  const handleEdit = (id) => navigate(`/edit-blog/${id}`);

  // Delete blog (only draft or ready)
  const handleDelete = async (id, status) => {
    if (status === "published") return toast.error("Cannot delete published blog");

    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  if (loading || loadingBlogs)
    return <p className="text-center mt-10">Loading...</p>;

  if (!blogs.length)
    return (
      <div className="text-center mt-10">
        <p>You have not created any blogs yet.</p>
        <button
          onClick={() => navigate("/blogs/create")}
          className="mt-4 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
        >
          Create Your First Blog
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-emerald-600 mb-6">My Blogs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="relative border rounded-2xl shadow-lg overflow-hidden bg-gray-50"
          >
            {b.imageUrl && (
              <img
                src={
                  b.imageUrl.startsWith("http")
                    ? b.imageUrl
                    : `http://localhost:4000${b.imageUrl}`
                }
                alt={b.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg">{b.title}</h2>
              {b.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {b.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                By: {b.author?.name || "Unknown"}
              </p>

              <div className="flex justify-between mt-4">
                {(b.status === "draft" || b.status === "ready") && (
                  <button
                    onClick={() => handleEdit(b._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                  >
                    Edit
                  </button>
                )}

                {b.status !== "published" && (
                  <button
                    onClick={() => handleDelete(b._id, b.status)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`absolute top-2 right-2 px-2 py-1 text-sm font-semibold rounded-full ${
                b.status === "draft"
                  ? "bg-gray-400 text-white"
                  : b.status === "ready"
                  ? "bg-yellow-500 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBlogs;


