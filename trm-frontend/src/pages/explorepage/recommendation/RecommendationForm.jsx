// src/components/recommendation/RecommendationFormUI.jsx
import React, { useState } from "react";
import api from "../../../utils/apiUtiles"; // your axios instance with token

const RecommendationFormUI = ({ onSubmitted, initialCredential = "Normal User" }) => {
  const [formData, setFormData] = useState({
    placeName: "",
    location: "",
    country: "",
    description: "",
    highlights: "",
    travelTips: "",
    bestTimeToVisit: "",
    culturalInfo: "",
    reason: "",
    experience: "",
    credentials: initialCredential,
  });

  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({ success: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.placeName || !formData.location || !formData.country || !formData.reason || !formData.description) {
      setStatus({ success: false, message: "Please fill all required fields." });
      return;
    }

    setLoading(true);
    setStatus({ success: null, message: "" });

    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    images.forEach((img) => data.append("images", img));

    try {
      const res = await api.post("/admin/recommendations", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ success: true, message: res.data.message });

      setFormData({
        placeName: "",
        location: "",
        country: "",
        description: "",
        highlights: "",
        travelTips: "",
        bestTimeToVisit: "",
        culturalInfo: "",
        reason: "",
        experience: "",
        credentials: initialCredential,
      });
      setImages([]);
      onSubmitted && onSubmitted(res.data.message);
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({
        success: false,
        message: err.response?.data?.message || err.message || "Error submitting recommendation",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      {/* Top Green Section */}
      

      {/* Status Message */}
      {status.message && (
        <p
          className={`mb-4 text-center font-semibold max-w-4xl w-full px-4 py-2 rounded ${
            status.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </p>
      )}

      {/* Main Form */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Place, Location, Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" name="placeName" placeholder="Place Name" value={formData.placeName} onChange={handleChange} className="border rounded-lg p-2 w-full" required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="border rounded-lg p-2 w-full" required />
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="border rounded-lg p-2 w-full" required />
          </div>

          {/* Your Role */}
          <input type="text" name="credentials" value={formData.credentials} readOnly className="border rounded-lg p-2 bg-gray-100 w-full" />

          {/* Why recommend & Your Experience Section */}
          <div className="bg-green-200 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Why Recommend This Place?</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why should others visit this place?"
                className="w-full p-3 rounded-lg text-gray-700 h-32 resize-none"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Your Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Share your personal experience"
                className="w-full p-3 rounded-lg text-gray-700 h-32 resize-none"
              />
            </div>
          </div>

          {/* Description */}
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border rounded-lg p-2 w-full h-40 resize-none" required />

          {/* Highlights */}
          <input type="text" name="highlights" placeholder="Highlights (comma separated)" value={formData.highlights} onChange={handleChange} className="border rounded-lg p-2 w-full" />

          {/* Travel Tips, Best Time, Cultural Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" name="travelTips" placeholder="Travel Tips" value={formData.travelTips} onChange={handleChange} className="border rounded-lg p-2 w-full" />
            <input type="text" name="bestTimeToVisit" placeholder="Best Time to Visit" value={formData.bestTimeToVisit} onChange={handleChange} className="border rounded-lg p-2 w-full" />
            <input type="text" name="culturalInfo" placeholder="Cultural Info" value={formData.culturalInfo} onChange={handleChange} className="border rounded-lg p-2 w-full" />
          </div>

          {/* Images */}
          <label className="block">
            <span className="text-gray-700 mb-1">Upload Images</span>
            <input type="file" name="images" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"/>
          </label>

          <button type="submit" disabled={loading} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition">
            {loading ? "Submitting..." : "Submit Recommendation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecommendationFormUI;


