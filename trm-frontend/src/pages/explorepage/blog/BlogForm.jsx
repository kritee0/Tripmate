import React from "react";
import ImageUploader from "./ImageUploader";

const BlogForm = ({ blogData, setBlogData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeywords = (e) => {
    setBlogData((prev) => ({ ...prev, keywords: e.target.value.split(",") }));
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        name="title"
        value={blogData.title}
        placeholder="Blog Title"
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="slug"
        value={blogData.slug}
        placeholder="Slug (auto or manual)"
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <textarea
        name="content"
        value={blogData.content}
        placeholder="Write your content here..."
        onChange={handleChange}
        rows={8}
        className="border p-2 rounded"
      />
      <input
        type="text"
        value={blogData.keywords.join(",")}
        placeholder="Keywords, separated by commas"
        onChange={handleKeywords}
        className="border p-2 rounded"
      />
      <ImageUploader
        imageUrl={blogData.imageUrl}
        onUpload={(url) => setBlogData((prev) => ({ ...prev, imageUrl: url }))}
      />
    </div>
  );
};

export default BlogForm;
