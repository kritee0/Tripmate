import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/common/Loader";

import HotelForm from "../admin/HotelForm";
import Modal from "../../components/Modal";

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPlace, setFilterPlace] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    placeId: "",
    name: "",
    description: "",
    image: null,
    address: "",
    contact: "",
    priceRange: "",
    amenities: [""],
    roomFeatures: [""],
    lat: "",
    long: "",
  });

  const API_URL = "http://localhost:4000/api/hotels";
  const PLACE_API_URL = "http://localhost:4000/api/places";

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API_URL, config);
      setHotels(res.data);
      setFilteredHotels(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch hotels" });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(PLACE_API_URL, config);
      setPlaces(res.data);
    } catch (err) {
      console.error("Failed to fetch places", err);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchPlaces();
  }, []);

  useEffect(() => {
    let filtered = hotels;
    if (search) {
      filtered = filtered.filter((hotel) =>
        hotel.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPlace) {
      filtered = filtered.filter((hotel) => hotel.placeId?._id === filterPlace);
    }
    setFilteredHotels(filtered);
  }, [search, filterPlace, hotels]);

  const resetForm = () => {
    setFormData({
      placeId: "",
      name: "",
      description: "",
      image: null,
      address: "",
      contact: "",
      priceRange: "",
      amenities: [""],
      roomFeatures: [""],
      lat: "",
      long: "",
    });
    setEditHotel(null);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      if (!formData.placeId || !formData.name) {
        throw new Error("Place ID and hotel name are required");
      }

      const data = new FormData();
      const payload = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(formData.long) || 0,
            parseFloat(formData.lat) || 0,
          ],
        },
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (["amenities", "roomFeatures", "location"].includes(key)) {
          data.append(key, JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          data.append("image", value);
        } else {
          data.append(key, value);
        }
      });

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editHotel) {
        await axios.put(`${API_URL}/${editHotel._id}`, data, config);
        setMessage({ type: "success", text: "Hotel updated successfully!" });
      } else {
        await axios.post(API_URL, data, config);
        setMessage({ type: "success", text: "Hotel added successfully!" });
      }

      setModalOpen(false);
      resetForm();
      fetchHotels();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${id}`, config);
      setMessage({ type: "success", text: "Hotel deleted successfully!" });
      setConfirmDelete(null);
      fetchHotels();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete hotel" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel(hotel);
    setFormData({
      placeId: hotel.placeId?._id || "",
      name: hotel.name || "",
      description: hotel.description || "",
      image: hotel.image,
      address: hotel.address || "",
      contact: hotel.contact || "",
      priceRange: hotel.priceRange || "",
      amenities: hotel.amenities.length ? hotel.amenities : [""],
      roomFeatures: hotel.roomFeatures.length ? hotel.roomFeatures : [""],
      lat: hotel.location?.coordinates?.[1] || "",
      long: hotel.location?.coordinates?.[0] || "",
    });
    setModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Manage Hotels
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all whitespace-nowrap"
        >
          + Add Hotel
        </button>
      </div>

      {/* Message */}
      {message && (
        <p
          className={`mb-4 p-3 rounded-md text-sm font-medium transition-all ${
            message.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Filters */}
      <div className=" flex md:flex-row flex-col   shadow-sm rounded-lg  p-4 mb-6 flex-wrap items-start sm:items-center gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="🔍 Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2   focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <select
          value={filterPlace}
          onChange={(e) => setFilterPlace(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2   focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="">All Places</option>
          {places.map((place) => (
            <option key={place._id} value={place._id}>
              {place.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-10">
          <Loader />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-100">
          {/* Scrollable wrapper */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-max w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-100 border-b text-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Place</th>
                  <th className="px-4 py-3 text-left font-medium">Address</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((hotel) => (
                  <tr
                    key={hotel._id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3">{hotel.name}</td>
                    <td className="px-4 py-3">{hotel.placeId?.name || "-"}</td>
                    <td className="px-4 py-3">{hotel.address}</td>
                    <td className="px-4 py-3">{hotel.contact}</td>
                    <td className="px-4 py-3">{hotel.priceRange}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <button
                          onClick={() => handleEdit(hotel)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete(hotel._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredHotels.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No hotels found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            resetForm();
          }}
          title={editHotel ? "Edit Hotel" : "Add New Hotel"}
        >
          <HotelForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            places={places}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Delete this hotel?
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHotels;
