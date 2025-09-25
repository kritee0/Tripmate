import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import BlogPreview from "./BlogPreview";
import toast from "react-hot-toast";

const BlogForm = ({ initialData = {}, onSave, saving }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [tags, setTags] = useState(initialData.tags || []);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");

  useEffect(() => {
    setTitle(initialData.title || "");
    setContent(initialData.content || "");
    setDescription(initialData.description || "");
    setTags(initialData.tags || []);
    setImageUrl(initialData.imageUrl || "");
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = (status) => {
    if (!title.trim()) return toast.error("Title is required");
    onSave({ title, content, description, tags, imageFile, imageUrl, status });
  };

  return (
    <div className="space-y-4">
      <label className="block mb-1 font-semibold">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold border-b border-gray-300 focus:outline-none p-1"
      />

      <label className="block mb-1 font-semibold">Content (Markdown)</label>
      <MDEditor value={content} onChange={setContent} height={300} className="border rounded" />

      <label className="block mb-1 font-semibold">Description</label>
      <textarea
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="block mb-1 font-semibold">Tags</label>
      <input
        type="text"
        value={tags.join(", ")}
        onChange={(e) => setTags(e.target.value.split(",").map(k => k.trim()))}
        className="w-full p-2 border rounded"
      />

      <label className="block mb-1 font-semibold">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-4">
        <button
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave("ready")}
          disabled={saving}
          className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
        >
          Mark Ready
        </button>
      </div>

      <BlogPreview blog={{ title, content, description, tags, imageUrl, status: initialData.status }} />
    </div>
  );
};

export default BlogForm;


