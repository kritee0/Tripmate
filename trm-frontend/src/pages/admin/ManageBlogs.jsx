// src/pages/admin/AdminManageBlogs.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/apiUtiles";
import Loader from "../../components/common/Loader";
import showdown from "showdown";

const converter = new showdown.Converter({
  simpleLineBreaks: true,
  strikethrough: true,
  tables: true,
  ghCompatibleHeaderId: true,
});

const AdminManageBlogs = () => {
  const { token, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all blogs (ready + published)
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBlogs(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchBlogs();
  }, [isAdmin]);

  const handlePublish = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/blogs/publish/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Blog published successfully!");
        fetchBlogs();
      } else {
        toast.error(res.data.message || "Failed to publish");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      const res = await api.delete(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Blog deleted successfully!");
        fetchBlogs();
        if (selectedBlog?._id === id) setSelectedBlog(null);
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdmin)
    return (
      <p className="text-red-500 font-semibold text-center mt-10">
        Access denied. Admins only.
      </p>
    );

  if (loading) return <Loader fullscreen={false} />;

  const readyBlogs = blogs.filter((b) => b.status === "ready");
  const publishedBlogs = blogs.filter((b) => b.status === "published");

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Panel */}
      <div className="lg:w-1/3 overflow-y-auto max-h-screen space-y-6">
        {/* Ready Blogs */}
        <div>
          <h2 className="text-xl font-bold mb-2">Ready Blogs</h2>
          {readyBlogs.length === 0 ? (
            <p className="text-gray-500">No ready blogs.</p>
          ) : (
            <ul className="space-y-2">
              {readyBlogs.map((blog) => (
                <li
                  key={blog._id}
                  onClick={() => setSelectedBlog(blog)}
                  className={`p-3 border cursor-pointer hover:bg-gray-100 transition rounded ${
                    selectedBlog?._id === blog._id ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="font-semibold">{blog.title}</p>
                  <p className="text-sm text-gray-500">
                    By: {blog.author?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs font-medium mt-1 text-yellow-700">
                    {blog.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Published Blogs */}
        <div>
          <h2 className="text-xl font-bold mt-6 mb-2">Published Blogs</h2>
          {publishedBlogs.length === 0 ? (
            <p className="text-gray-500">No published blogs.</p>
          ) : (
            <ul className="space-y-2">
              {publishedBlogs.map((blog) => (
                <li
                  key={blog._id}
                  onClick={() => setSelectedBlog(blog)}
                  className={`p-3 border cursor-pointer hover:bg-gray-100 transition rounded ${
                    selectedBlog?._id === blog._id ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="font-semibold">{blog.title}</p>
                  <p className="text-sm text-gray-500">
                    By: {blog.author?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs font-medium mt-1 text-green-700">
                    {blog.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="lg:w-2/3 bg-white shadow rounded p-4 max-h-screen overflow-y-auto relative">
        {selectedBlog ? (
          <>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedBlog(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedBlog.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              By: {selectedBlog.author?.name || "Unknown"}
            </p>

            {selectedBlog.imageUrl && (
              <img
                src={`http://localhost:4000${selectedBlog.imageUrl}`}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover mb-4 rounded"
              />
            )}

            <p className="mb-2 text-gray-700 font-semibold">
              {selectedBlog.description}
            </p>

            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-800 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-table:border prose-table:border-gray-300 prose-th:border prose-td:border"
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(selectedBlog.content || ""),
              }}
            />

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {selectedBlog.status === "ready" && (
                <button
                  onClick={() => handlePublish(selectedBlog._id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {actionLoading ? "Publishing..." : "Publish"}
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedBlog._id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-20">
            Select a blog to preview
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminManageBlogs;





