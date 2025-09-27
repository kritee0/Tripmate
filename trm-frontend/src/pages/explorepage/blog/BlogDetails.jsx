// src/pages/explorepage/blog/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/apiUtiles";
import Loader from "../../../components/common/Loader";
import showdown from "showdown";
import NavBarLoggedIn from "../../../components/common/Navbar1";
import Footer from "../../../components/common/Footer";
import { ArrowLeft } from "lucide-react"; // nice icon for back button

const converter = new showdown.Converter({
  simpleLineBreaks: true,
  strikethrough: true,
  tables: true,
  ghCompatibleHeaderId: true,
});

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <Loader fullscreen={true} />;
  if (!blog) return <p className="text-center text-gray-500">Blog not found.</p>;

  return (
    <>
      {/* Navbar */}
      <NavBarLoggedIn />

      {/* Blog Content */}
      <div className="pt-28 pb-12">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded relative">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-4 -left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            By: {blog.author?.name || "Unknown"} •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          {blog.imageUrl && (
            <img
              src={`http://localhost:4000${blog.imageUrl}`}
              alt={blog.title}
              className="w-full h-80 object-cover rounded mb-4"
            />
          )}

          <p className="mb-4 text-gray-700 font-semibold">{blog.description}</p>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: converter.makeHtml(blog.content || ""),
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default BlogDetails;



