// src/components/post/PostItem.jsx
import React from "react";
import { Heart, MessageCircle } from "lucide-react";

const PostItem = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {post.author?.name?.[0] || "U"}
        </div>
        <div className="ml-3">
          <p className="font-semibold">{post.author?.name || "You"}</p>
        </div>
      </div>
      <p className="mb-2">{post.content}</p>
      {post.image && (
        <img src={post.image} alt="Post" className="w-full h-64 object-cover rounded-lg mb-2" />
      )}
      <div className="flex gap-4 text-gray-600">
        <button className="flex items-center gap-1">
          <Heart className="w-5 h-5" /> {post.likes.length}
        </button>
        <button className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5" /> {post.comments.length}
        </button>
      </div>
    </div>
  );
};

export default PostItem;
