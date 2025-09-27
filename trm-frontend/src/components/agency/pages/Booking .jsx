import React, { useEffect, useState } from "react";
import api from "../../../utils/apiUtiles" // axios instance
import Loader from "../../common/Loader"

const AgencyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings for agency packages
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/agencies/bookings"); // agency route
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error("Error fetching agency bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings for your packages yet.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Booking ID</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Package</th>
              <th className="border px-4 py-2">Travellers</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="text-center">
                <td className="border px-4 py-2">{booking.bookingId}</td>
                <td className="border px-4 py-2">{booking.user.name}</td>
                <td className="border px-4 py-2">{booking.travelPackage?._id}</td>
                <td className="border px-4 py-2">{booking.numberOfTravellers}</td>
                <td className="border px-4 py-2">${booking.totalPrice}</td>
                <td className="border px-4 py-2">{booking.status}</td>
                <td className="border px-4 py-2">
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgencyBookings;


















