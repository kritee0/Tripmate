import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import axios from "axios";

const PackageForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    image: null,
    price: "",
    duration: "",
    overview: "",
    category: "",
    bestSeason: "",
    transportAvailableOnArrival: false,
    highlights: [""],
    itinerary: [
      { day: 1, title: "", activities: [""], meals: [""], accommodation: "" },
    ],
    policy: { included: [""], excluded: [""], cancellation: "", payment: "" },
  });

  // --- Handle nested arrays like highlights, itinerary activities & meals ---
  const handleArrayChange = (section, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (section) => {
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], ""] }));
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // --- Itinerary handlers ---
  const addDay = () =>
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", activities: [""], meals: [""], accommodation: "" },
      ],
    }));

  const removeDay = (i) =>
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, idx) => idx !== i)
        .map((day, idx) => ({ ...day, day: idx + 1 })),
    }));

  const updateDayField = (dayIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  const updateNestedDayArray = (dayIndex, arrayName, index, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, [arrayName]: day[arrayName].map((item, j) => (j === index ? value : item)) }
          : day
      ),
    }));
  };

  const addNestedDayItem = (dayIndex, arrayName) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex ? { ...day, [arrayName]: [...day[arrayName], ""] } : day
      ),
    }));
  };

  const removeNestedDayItem = (dayIndex, arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, [arrayName]: day[arrayName].filter((_, j) => j !== index) }
          : day
      ),
    }));
  };

  // --- Policy array handlers ---
  const handlePolicyArrayChange = (section, index, value) => {
    setFormData((prev) => ({
      ...prev,
      policy: {
        ...prev.policy,
        [section]: prev.policy[section].map((item, i) => (i === index ? value : item)),
      },
    }));
  };

  const addPolicyItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      policy: { ...prev.policy, [section]: [...prev.policy[section], ""] },
    }));
  };

  const removePolicyItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      policy: { ...prev.policy, [section]: prev.policy[section].filter((_, i) => i !== index) },
    }));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData.image) {
        data.append("image", formData.image);
      } else if (["itinerary", "policy", "highlights"].includes(key)) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/packages", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      alert("Package created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create package");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-xl space-y-6">
      {/* Basic info */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Package Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Overview"
          value={formData.overview}
          onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Category, season, duration, price */}
      <div className="grid md:grid-cols-4 gap-4">
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Mountain">Mountain</option>
          <option value="Culture">Culture</option>
          <option value="Trekking">Trekking</option>
          <option value="City">City</option>
          <option value="Adventure">Adventure</option>
        </select>

        <input
          type="text"
          placeholder="Best Season"
          value={formData.bestSeason}
          onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="border p-2 rounded"
          required
        />
      </div>

      {/* Transport */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.transportAvailableOnArrival}
            onChange={(e) => setFormData({ ...formData, transportAvailableOnArrival: e.target.checked })}
          />
          Transport Available On Arrival
        </label>
      </div>

      {/* Image */}
      <div>
        <label>Package Image</label>
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          accept="image/*"
          className="w-full"
        />
      </div>

      {/* Highlights */}
      <div>
        <h3 className="font-semibold">Highlights</h3>
        {formData.highlights.map((h, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={h}
              onChange={(e) => handleArrayChange("highlights", i, e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            {formData.highlights.length > 1 && (
              <button type="button" onClick={() => removeArrayItem("highlights", i)} className="text-red-600">
                <Trash2 />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem("highlights")} className="flex items-center gap-2 text-blue-600">
          <Plus /> Add Highlight
        </button>
      </div>

      {/* Itinerary */}
      <div>
        <h3 className="font-semibold">Itinerary</h3>
        {formData.itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="border p-4 rounded mb-4 bg-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h4>Day {day.day}</h4>
              {formData.itinerary.length > 1 && (
                <button type="button" onClick={() => removeDay(dayIndex)} className="text-red-600">
                  <Trash2 />
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Day Title"
              value={day.title}
              onChange={(e) => updateDayField(dayIndex, "title", e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            {/* Activities */}
            <div>
              <label>Activities</label>
              {day.activities.map((a, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={a}
                    onChange={(e) => updateNestedDayArray(dayIndex, "activities", i, e.target.value)}
                    className="flex-1 border p-2 rounded"
                  />
                  {day.activities.length > 1 && (
                    <button type="button" onClick={() => removeNestedDayItem(dayIndex, "activities", i)} className="text-red-600">
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addNestedDayItem(dayIndex, "activities")} className="flex items-center gap-2 text-blue-600">
                <Plus /> Add Activity
              </button>
            </div>

            {/* Meals */}
            <div>
              <label>Meals</label>
              {day.meals.map((m, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => updateNestedDayArray(dayIndex, "meals", i, e.target.value)}
                    className="flex-1 border p-2 rounded"
                  />
                  {day.meals.length > 1 && (
                    <button type="button" onClick={() => removeNestedDayItem(dayIndex, "meals", i)} className="text-red-600">
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addNestedDayItem(dayIndex, "meals")} className="flex items-center gap-2 text-blue-600">
                <Plus /> Add Meal
              </button>
            </div>

            {/* Accommodation */}
            <input
              type="text"
              placeholder="Accommodation"
              value={day.accommodation}
              onChange={(e) => updateDayField(dayIndex, "accommodation", e.target.value)}
              className="w-full border p-2 rounded mt-2"
            />
          </div>
        ))}
        <button type="button" onClick={addDay} className="flex items-center gap-2 text-blue-600">
          <Plus /> Add Day
        </button>
      </div>

      {/* Policy */}
      <div>
        <h3 className="font-semibold">Policy</h3>

        {["included", "excluded"].map((section) => (
          <div key={section} className="mb-2">
            <label className="capitalize">{section}</label>
            {formData.policy[section].map((item, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handlePolicyArrayChange(section, i, e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                {formData.policy[section].length > 1 && (
                  <button type="button" onClick={() => removePolicyItem(section, i)} className="text-red-600">
                    <Trash2 />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addPolicyItem(section)} className="flex items-center gap-2 text-blue-600">
              <Plus /> Add {section.slice(0, -1)}
            </button>
          </div>
        ))}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Cancellation Policy"
            value={formData.policy.cancellation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                policy: { ...prev.policy, cancellation: e.target.value },
              }))
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Payment Policy"
            value={formData.policy.payment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                policy: { ...prev.policy, payment: e.target.value },
              }))
            }
            className="border p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Save /> Save Package
      </button>
    </form>
  );
};

export default PackageForm;

