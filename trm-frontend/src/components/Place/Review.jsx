import React, { useEffect, useState } from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ReviewSection = ({ placeId }) => {
  const { user } = useAuth(); // logged-in user
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch reviews for this place
  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${placeId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [placeId]);

  // Add or update review
  const handleSubmit = async () => {
    if (!newComment.trim() && newRating === 0) return;

    setLoading(true);
    try {
      const url = editingReview
        ? `http://localhost:4000/api/reviews/${editingReview._id}`
        : "http://localhost:4000/api/reviews/";
      const method = editingReview ? "PATCH" : "POST";

      const body = editingReview
        ? { comment: newComment, rating: newRating }
        : { placeId, comment: newComment, rating: newRating };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setNewComment("");
        setNewRating(0);
        setEditingReview(null);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing a review
  const startEdit = (rev) => {
    setEditingReview(rev);
    setNewComment(rev.comment || "");
    setNewRating(rev.rating || 0);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>

      {/* Add/Edit Review */}
      {user && (
        <div className="mb-6 p-4 border rounded-lg w-full md:w-1/2">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-5 h-5 cursor-pointer ${
                  i <= newRating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setNewRating(i)}
              />
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingReview ? "Update Review" : "Add Review"}
          </button>
          {editingReview && (
            <button
              onClick={() => {
                setEditingReview(null);
                setNewComment("");
                setNewRating(0);
              }}
              className="mt-2 ml-2 px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Review List */}
      <div className="flex flex-wrap gap-4">
        {reviews.map((rev) => {
          const reviewUserId =
            typeof rev.user === "object" ? rev.user._id?.toString() : rev.user?.toString();
          const isOwner = user?._id === reviewUserId;

          return (
            <div
              key={rev._id}
              className="p-4 border rounded-lg w-full md:w-1/2 relative"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{rev.user?.name || "User"}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= (rev.rating || 0) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{rev.comment}</p>

              {/* Edit/Delete buttons only for owner */}
              {isOwner && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <Edit
                    className="w-4 h-4 cursor-pointer text-blue-600"
                    onClick={() => startEdit(rev)}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-600"
                    onClick={() => handleDelete(rev._id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;


