// src/pages/explore/ExplorePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../utils/apiUtiles";
import BlogPreview from "../explorepage/blog/BlogPreview";

const ExplorePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs"); // fetch all blogs
        if (res.data.success) {
          // only show published blogs
          const publishedBlogs = res.data.data.filter((b) => b.status === "published");
          setBlogs(publishedBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        toast.error("Failed to load blogs");
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, []);

  if (authLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center mb-8 border-l-8 border-green-900">
          <h1 className="text-3xl text-green-900 font-bold">Explore Nepal Blogs</h1>
          <p className="text-gray-700 mt-2">
            Read stories, travel tips, and experiences shared by fellow travelers!
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors"
              onClick={() => {
                toast.success("Redirecting to Blog Creation Page...");
                navigate("/blogs/create");
              }}
            >
              Create Blog
            </button>

            {user && (
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                onClick={() => navigate("/blogs/my-blogs")}
              >
                My Blogs
              </button>
            )}
          </div>
        </div>

        {/* Blogs Grid */}
        {loadingBlogs ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div
                key={b._id}
                className="cursor-pointer"
                onClick={() => navigate(`/blogs/${b._id}`)}
              >
                <BlogPreview blog={b} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;





