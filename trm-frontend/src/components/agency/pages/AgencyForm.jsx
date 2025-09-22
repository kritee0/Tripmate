import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const BecomeAgency = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ define navigate

  const [form, setForm] = useState({
    agencyName: "",
    agencyEmail: "",
    licenseNumber: "",
    documents: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setForm((f) => ({ ...f, agencyEmail: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "agencyName") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, documents: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("agencyName", form.agencyName);
      formData.append("agencyEmail", form.agencyEmail);
      formData.append("licenseNumber", form.licenseNumber);

      if (!form.documents || form.documents.length === 0) {
        setMessage("Please upload at least one document.");
        setLoading(false);
        return;
      }

      for (let i = 0; i < form.documents.length; i++) {
        formData.append("documents", form.documents[i]);
      }

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:4000/api/agency-applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("We have received your application. We are confirming your data.");
      setSubmitted(true);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Something went wrong";
      setMessage(errMsg);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Header with Logo + Back button */}
      <div className="w-full bg-white shadow-md p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-600 font-medium hover:underline"
        >
          ← Back
        </button>
        <div
          onClick={() => navigate("/")}
          className="flex-1 text-center font-bold text-cyan-600 text-lg cursor-pointer"
        >
          TripMate
        </div>
      </div>

      {/* 🔹 Form Section */}
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Apply as Travel Agency
          </h1>

          {user?.name && (
            <p className="text-sm text-gray-500 mb-4 text-center">
              Logged in as: {user.name} ({user.email})
            </p>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="agencyName"
                value={form.agencyName}
                onChange={handleChange}
                placeholder="Agency Name"
                required
                pattern="[A-Za-z\s]+"
                title="Agency name should only contain letters and spaces"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="email"
                name="agencyEmail"
                value={form.agencyEmail}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />

              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="License Number"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="file"
                name="documents"
                multiple
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          ) : (
            <p className="text-center text-green-600 font-semibold">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeAgency;



