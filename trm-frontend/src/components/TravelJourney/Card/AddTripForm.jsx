import React, { useState } from "react";

const AddTripForm = ({ placeId, placeName, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    
      if (startDate < today || endDate < today) {
        throw new Error("Dates cannot be in the past");
      }
      if (endDate < startDate) {
        throw new Error("End date cannot be before start date");
      }
      if (reminderDate && reminderDate < today) {
        throw new Error("Reminder date cannot be in the past");
      }

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/journey/next-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placeId,
          placeName,
          startDate,
          endDate,
          reminderDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save trip");

      onClose("Trip saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Plan Your Trip</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              required
              min={today} 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              required
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reminder Date
          </label>
          <input
            type="date"
            min={today} 
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Trip"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTripForm;
