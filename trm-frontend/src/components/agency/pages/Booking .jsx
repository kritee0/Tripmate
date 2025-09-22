import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const BookingForm = ({ pkg, onClose }) => {
  const { user } = useAuth();

  // Prefill user info
  const [formData, setFormData] = useState({
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
    numberOfPeople: 1,
    travelDate: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [lastBookingId, setLastBookingId] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (formData.numberOfPeople < 1) {
      setStatus({ type: "error", message: "Number of travellers must be at least 1." });
      return;
    }

    const today = new Date();
    const selectedDate = new Date(formData.travelDate);
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      setStatus({ type: "error", message: "Travel date cannot be in the past." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus({ type: "error", message: "Please log in first." });
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/api/bookings",
        { ...formData, packageId: pkg._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStatus({ type: "success", message: "Booking successful! We’ll contact you soon." });
        setLastBookingId(res.data.data._id);
      } else {
        setStatus({ type: "error", message: res.data.message || "Booking failed." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!lastBookingId) {
      setStatus({ type: "error", message: "No booking to cancel." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/bookings/${lastBookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ type: "error", message: "Booking cancelled." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to cancel booking." });
    }
  };

  const packagePrice = parseFloat(pkg?.price) || 0;
  const totalPrice = packagePrice * formData.numberOfPeople;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border-y-4 border-blue-200">
        <h2 className="text-xl font-bold mb-3 text-center">
          Book {pkg?.name || "Package"}
        </h2>

        {status.message && (
          <div className={`mb-3 p-2 text-sm rounded ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {status.message}
          </div>
        )}

        {status.type === "success" ? (
          <div className="text-center space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Close
            </button>
            <button onClick={handleCancelBooking} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cancel Booking
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Display user info */}
            <div className="p-3 bg-gray-50 rounded border text-sm text-gray-700">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p className="text-gray-500 mt-1">These details will be used for the booking.</p>
            </div>

            {/* Editable fields */}
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              min="1"
              placeholder="Number of travellers"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]}
              required
            />

            {/* Price info */}
            <div className="text-sm font-medium text-gray-800">
              <div>Price per person: Rs. {packagePrice.toLocaleString("en-IN")}</div>
              <div>Total: Rs. {totalPrice.toLocaleString("en-IN")}</div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Saving..." : "Book"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingForm;















