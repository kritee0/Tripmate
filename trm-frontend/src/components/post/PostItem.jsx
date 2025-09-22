// src/components/post/PostItem.jsx
import React from "react";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";

const PostItem = ({ post, onLike, onComment }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-2xl mx-auto">
      {/* Author info */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {post.author?.name?.[0] || "U"}
        </div>
        <div className="ml-3">
          <p className="font-semibold">{post.author?.name || "You"}</p>
          {post.location && (
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" /> {post.location}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="mb-3">{post.content}</p>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-64 object-cover rounded-lg mb-3"
        />
      )}

      {/* Action buttons */}
      <div className="flex gap-4 text-gray-600">
        <button
          className="flex items-center gap-1"
          onClick={() => onLike && onLike(post._id)}
        >
          <Heart className="w-5 h-5" /> {post.likes.length || 0}
        </button>
        <button
          className="flex items-center gap-1"
          onClick={() => onComment && onComment(post._id)}
        >
          <MessageCircle className="w-5 h-5" /> {post.comments.length || 0}
        </button>
        <button className="flex items-center gap-1">
          <Share2 className="w-5 h-5" /> Share
        </button>
      </div>
    </div>
  );
};

export default PostItem;



