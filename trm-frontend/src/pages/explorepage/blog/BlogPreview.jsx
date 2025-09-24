import React from "react";
import showdown from "showdown";

const converter = new showdown.Converter({
  simpleLineBreaks: true,
  strikethrough: true,
  tables: true,
  ghCompatibleHeaderId: true,
});

const BlogPreview = ({ blog }) => {
  if (!blog) return null;

  const markdown = blog.content || "";
  const html = converter.makeHtml(markdown);

  return (
    <div className="p-4 border rounded space-y-4">
      {/* Title */}
      {blog.title && (
        <h1 className="text-2xl font-bold">{blog.title}</h1>
      )}

      {/* Description */}
      {blog.description && (
        <p className="text-gray-600 italic">{blog.description}</p>
      )}

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-200 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Image */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt="Blog"
          className="w-full rounded-lg"
        />
      )}

      {/* Markdown content */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-800 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-table:border prose-table:border-gray-300 prose-th:border prose-td:border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default BlogPreview;





