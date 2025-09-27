// src/pages/explorepage/blog/BlogCard.jsx
import React from "react";

const BlogCard = ({ blog, onClick, showActions, onEdit, onDelete, onReadMore }) => {
  return (
    <div
      onClick={onClick}
      className="relative border rounded-2xl shadow-lg overflow-hidden bg-gray-50 hover:shadow-xl transition cursor-pointer"
    >
      {/* Blog Image */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl.startsWith("http") ? blog.imageUrl : `http://localhost:4000${blog.imageUrl}`}
          alt={blog.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h2 className="font-bold text-lg">{blog.title}</h2>
        {blog.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{blog.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">By: {blog.author?.name || "Unknown"}</p>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
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

        {/* Read More Link */}
        {onReadMore && (
          <p
            onClick={(e) => { e.stopPropagation(); onReadMore(blog._id); }}
            className="text-green-600 mt-2 text-sm cursor-pointer hover:underline"
          >
            Read More
          </p>
        )}

        {/* Actions for MyBlogs */}
        {showActions && (
          <div className="flex justify-between mt-4">
            {(blog.status === "draft" || blog.status === "ready") && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(blog._id); }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
              >
                Edit
              </button>
            )}

            {blog.status !== "published" && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(blog._id, blog.status); }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status badge */}
      {showActions && (
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-sm font-semibold rounded-full ${
            blog.status === "draft"
              ? "bg-gray-400 text-white"
              : blog.status === "ready"
              ? "bg-yellow-500 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {blog.status}
        </span>
      )}
    </div>
  );
};

export default BlogCard;


