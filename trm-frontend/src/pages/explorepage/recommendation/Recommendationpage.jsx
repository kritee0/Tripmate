import React, { useState } from "react";
import RecommendationFormUI from "../recommendation/RecommendationForm";
import { useNavigate, useLocation } from "react-router-dom";

const RecommendationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the selected credential passed from ExplorePage modal
  const initialCredential = location.state?.credential || "Normal User";

  const [successMessage, setSuccessMessage] = useState(null);

  const handleFormSubmitted = (message) => {
    if (!message) {
      navigate(-1);
    } else {
      setSuccessMessage(message);
      setTimeout(() => navigate(-1), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-800">
        Recommend a New Place
      </h1>

      {/* Show Form directly */}
      {!successMessage && (
        <RecommendationFormUI
          onSubmitted={handleFormSubmitted}
          initialCredential={initialCredential}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl shadow-md mt-4 max-w-xl w-full text-center">
          {successMessage}
          <p className="text-sm mt-2">Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;

