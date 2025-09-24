// src/pages/explore/blog/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/apiUtiles";
import Loader from "../../../components/common/Loader";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data.success) setBlog(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <Loader fullscreen={false} />;
  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">By: {blog.author?.name || "Unknown"}</p>

      {blog.imageUrl && (
        <img
          src={`http://localhost:4000${blog.imageUrl}`}
          alt={blog.title}
          className="w-full h-96 object-cover mb-6 rounded"
        />
      )}

      <p className="text-gray-700 mb-4 font-semibold">{blog.description}</p>
      <p className="text-gray-600 whitespace-pre-wrap mb-6">{blog.content}</p>

      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDetails;

