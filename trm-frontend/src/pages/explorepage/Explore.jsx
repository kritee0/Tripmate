import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../utils/apiUtiles";
import BlogCard from "../explorepage/blog/BlogCard";

const ExplorePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [unpublishedBlogs, setUnpublishedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        if (res.data.success) {
          const allBlogs = res.data.data;

          // Published blogs
          setPublishedBlogs(allBlogs.filter((b) => b.status === "published"));

          // User's draft/ready blogs
          if (user) {
            const myUnpublished = allBlogs.filter(
              (b) =>
                b.author?._id === user._id &&
                (b.status === "draft" || b.status === "ready")
            );
            setUnpublishedBlogs(myUnpublished);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading blogs...</p>;

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center mb-8 border-l-8 border-green-900">
          <h1 className="text-3xl text-green-900 font-bold">Explore Nepal Blogs</h1>
          <p className="text-gray-700 mt-2">
            Read stories, travel tips, and experiences shared by fellow travelers!
          </p>

          {/* Buttons: always show */}
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors"
              onClick={() => navigate("/blogs/create")}
            >
              Create Blog
            </button>

            <button
              className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/blogs/my-blogs")}
            >
              My Blogs
            </button>
          </div>
        </div>

        {/* Optional Preview of User's Draft/Ready Blogs */}
        {user && unpublishedBlogs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Unpublished Blogs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {unpublishedBlogs.map((b) => (
                <BlogCard
                  key={b._id}
                  blog={b}
                  showActions={true}
                  onClick={() => navigate(`/blogs/${b._id}`)}
                  onEdit={(id) => navigate(`/edit-blog/${id}`)}
                  onDelete={() => toast("Go to My Blogs page to delete")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Published Blogs */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Published Blogs</h2>
          {publishedBlogs.length === 0 ? (
            <p className="text-center text-gray-500">No blogs published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedBlogs.map((b) => (
                <BlogCard
                  key={b._id}
                  blog={b}
                  showActions={false}
                  onClick={() => navigate(`/blogs/${b._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;







