import React from "react";

const BlogPreview = ({ blog }) => {
  return (
    <div className="border p-4 rounded bg-gray-50">
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt="Blog"
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold text-emerald-600 mb-2">{blog.title}</h2>

      {/* Status */}
      {blog.status && (
        <p className="text-sm font-semibold mb-2">
          Status:{" "}
          <span
            className={`${
              blog.status === "draft"
                ? "text-gray-700"
                : blog.status === "ready"
                ? "text-yellow-700"
                : blog.status === "approved"
                ? "text-green-700"
                : ""
            }`}
          >
            {blog.status.toUpperCase()}
          </span>
        </p>
      )}

      {/* Description */}
      {blog.description && (
        <p className="text-gray-700 italic mb-2">{blog.description}</p>
      )}

      {/* Content */}
      <p className="mb-2">{blog.content}</p>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {blog.tags.map((tag, i) => (
            <span key={i} className="text-sm bg-gray-200 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPreview;



