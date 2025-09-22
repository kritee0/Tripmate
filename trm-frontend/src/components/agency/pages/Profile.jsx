import React, { useEffect, useState } from "react";
import axios from "axios";

const AgencyProfile = () => {
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  // ✅ Fetch agency profile
  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/agencies/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgency(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching agency profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save updated profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/agencies/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgency(formData);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Agency Profile</h2>

      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {agency?.name}</p>
          <p><strong>Email:</strong> {agency?.email}</p>
          <p><strong>Phone:</strong> {agency?.phone}</p>
          <p><strong>Description:</strong> {agency?.description}</p>

          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Agency Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Phone"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Description"
          />

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyProfile;
