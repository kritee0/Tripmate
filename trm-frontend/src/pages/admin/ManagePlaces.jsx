import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/common/Loader";
import Modal from "../../components/Modal";
import PlaceForm from "./PlaceForm";
import PlaceTable from "./PlaceTable";

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlace, setEditPlace] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStyle, setFilterStyle] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    images: [],
    bestSeason: "",
    travelTips: "",
    travelStyles: [],
    topAttractions: [{ name: "", type: "", image: null, existingImage: "" }],
    thingsToDo: [{ title: "", description: "", travelStyle: "", image: null, existingImage: "" }],
    localCulture: [{ festival: "", description: "", image: null, existingImage: "" }],
    localCuisine: [{ dish: "", description: "", image: null, existingImage: "" }],
  });

  const API_URL = "http://localhost:4000/api/places";

  // ------------------ FETCH PLACES ------------------
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API_URL, config);
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to fetch places" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // ------------------ RESET FORM ------------------
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      images: [],
      bestSeason: "",
      travelTips: "",
      travelStyles: [],
      topAttractions: [{ name: "", type: "", image: null, existingImage: "" }],
      thingsToDo: [{ title: "", description: "", travelStyle: "", image: null, existingImage: "" }],
      localCulture: [{ festival: "", description: "", image: null, existingImage: "" }],
      localCuisine: [{ dish: "", description: "", image: null, existingImage: "" }],
    });
    setEditPlace(null);
  };

  // ------------------ OPEN MODAL ------------------
  const openModal = (place = null) => {
    if (place) {
      setEditPlace(place);
      setFormData({
        name: place.name || "",
        description: place.description || "",
        address: place.address || "",
        images: [],
        bestSeason: place.bestSeason?.[0]?.season || "",
        travelTips: place.travelTips?.[0]?.title || "",
        travelStyles: place.travelStyles || [],
        topAttractions: (place.topAttractions || []).map((a) => ({
          name: a.name || "",
          type: a.type || "",
          image: null,
          existingImage: a.image || "",
        })),
        thingsToDo: (place.thingsToDo || []).map((t) => ({
          title: t.title || "",
          description: t.description || "",
          travelStyle: t.travelStyle || "",
          image: null,
          existingImage: t.image || "",
        })),
        localCulture: (place.localCulture || []).map((c) => ({
          festival: c.festival || "",
          description: c.description || "",
          image: null,
          existingImage: c.image || "",
        })),
        localCuisine: (place.localCuisine || []).map((c) => ({
          dish: c.dish || "",
          description: c.description || "",
          image: null,
          existingImage: c.image || "",
        })),
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  // ------------------ SUBMIT FORM ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (["travelStyles", "topAttractions", "thingsToDo", "localCulture", "localCuisine"].includes(key)) {
          data.append(key, JSON.stringify(value.map(v => {
            const copy = { ...v };
            delete copy.image;
            delete copy.existingImage;
            return copy;
          })));
          value.forEach((v, i) => {
            if (v.image instanceof File) data.append(`${key}Images`, v.image);
          });
        } else if (key === "images") {
          value.forEach((img) => img instanceof File && data.append("images", img));
        } else {
          data.append(key, value);
        }
      });

      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editPlace) {
        await axios.put(`${API_URL}/${editPlace._id}`, data, config);
        setMessage({ type: "success", text: "Place updated successfully!" });
      } else {
        await axios.post(API_URL, data, config);
        setMessage({ type: "success", text: "Place added successfully!" });
      }

      setModalOpen(false);
      resetForm();
      fetchPlaces();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------ DELETE PLACE ------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${id}`, config);
      setMessage({ type: "success", text: "Place deleted successfully!" });
      fetchPlaces();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete place" });
    } finally {
      setLoading(false);
    }
  };

  // ------------------ FILTER & SEARCH ------------------
  const filteredPlaces = places.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStyle ? p.travelStyles.includes(filterStyle) : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">🏝️ Manage Places</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Filter by Style</option>
            <option value="City">City</option>
            <option value="Food">Food</option>
            <option value="Temple">Temple</option>
            <option value="Adventure">Adventure</option>
          </select>

          <button
            onClick={() => openModal()}
            className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition"
          >
            ➕ Add New Place
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <p
          className={`mb-4 p-3 rounded-lg text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <Loader />
        </div>
      ) : (
        <PlaceTable
          places={filteredPlaces}
          onEdit={openModal}
          onDelete={handleDelete}
          onView={setSelectedPlace}
        />
      )}

      {/* Common Modal for Create/Edit */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          title={editPlace ? "Edit Place" : "Add New Place"}
          onClose={() => {
            setModalOpen(false);
            resetForm();
          }}
        >
          <PlaceForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </Modal>
      )}

      {/* Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => setSelectedPlace(null)}
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedPlace.name}</h3>
            <p className="text-gray-700 mb-3">{selectedPlace.description}</p>
            <p className="text-gray-500 text-sm mb-3">📍 {selectedPlace.address}</p>
            {selectedPlace.travelStyles?.length > 0 && (
              <p className="text-sm mb-2">
                <span className="font-semibold text-gray-700">Styles:</span>{" "}
                {selectedPlace.travelStyles.join(", ")}
              </p>
            )}
            {selectedPlace.topAttractions?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold mb-1">Top Attractions:</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {selectedPlace.topAttractions.map((a, i) => (
                    <li key={i}>{a.name} ({a.type})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlaces;
