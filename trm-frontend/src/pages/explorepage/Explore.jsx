// src/pages/explore/ExplorePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationCard from "../explorepage/recommendation/recommendationCard"
import api from "../../utils/apiUtiles";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/admin/recommendations/approved");
        if (res.data.success) setRecommendations(res.data.recommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleCredentialSelect = (credential) => {
    setShowPrompt(false);
    navigate("/explore/recommendplace", { state: { credential } });
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-6xl mx-auto px-6 pt-8">

        {/* Hero Section */}
        <div className="bg-white-100 rounded-xl shadow-lg p-6 text-center mb-8 border-l-8 border-green-900">
          <h1 className="text-3xl  text-green-900 font-bold">Explore Nepal</h1>
          <p className="text-gray-700 mt-2">
            Explore top places recommended by travelers like you!
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            <button
              className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              onClick={() => setShowPrompt(true)}
            >
              Recommend a Place
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <p className="text-center text-gray-500">Loading recommendations...</p>}

        {/* No recommendations */}
        {!loading && recommendations.length === 0 && (
          <p className="text-center text-gray-500">No recommendations yet.</p>
        )}

        {/* Grid Feed */}
        {!loading && recommendations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <RecommendationCard 
                key={rec._id} 
                rec={rec} 
                cardColor="bg-green-100 hover:bg-green-200" // pass color class
              />
            ))}
          </div>
        )}

        {/* Recommend Prompt Modal */}
        {showPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-4">
                How would you like to recommend this place?
              </h2>
              <p className="text-gray-600 mb-6">Choose your role to continue:</p>
              <div className="flex flex-col gap-3">
                {["Normal User", "Travel Blogger", "Local Guide"].map((cred) => (
                  <button
                    key={cred}
                    onClick={() => handleCredentialSelect(cred)}
                    className="px-4 py-2 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    {cred}
                  </button>
                ))}
              </div>
              <button
                className="mt-6 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExplorePage;





;