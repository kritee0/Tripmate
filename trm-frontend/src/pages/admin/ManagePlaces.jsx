import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/common/Loader";
import PlaceForm from "./PlaceForm";

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editPlace, setEditPlace] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    images: [],
    travelStyles: [],
    topAttractions: [{ name: "", image: null, existingImage: "" }],
    thingsToDo: [{ title: "", description: "", image: null, existingImage: "" }],
  });

  const API_URL = "http://localhost:4000/api/places";

 
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API_URL, config);
      setPlaces(res.data);
    } catch (err) {
      console.error("Fetch places error:", err);
      setMessage({ type: "error", text: "Failed to fetch places" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceImages = (e) => {
    setFormData((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

 
  const handleAttractionChange = (i, value) => {
    const updated = [...formData.topAttractions];
    updated[i].name = value;
    setFormData((prev) => ({ ...prev, topAttractions: updated }));
  };
  const handleAttractionImage = (i, file) => {
    const updated = [...formData.topAttractions];
    updated[i].image = file;
    setFormData((prev) => ({ ...prev, topAttractions: updated }));
  };
  const addAttraction = () => {
    setFormData((prev) => ({
      ...prev,
      topAttractions: [...prev.topAttractions, { name: "", image: null }],
    }));
  };
  const removeAttraction = (i) => {
    const updated = [...formData.topAttractions];
    updated.splice(i, 1);
    setFormData((prev) => ({ ...prev, topAttractions: updated }));
  };


  const handleThingsToDoChange = (i, value) => {
    const updated = [...formData.thingsToDo];
    updated[i].title = value;
    setFormData((prev) => ({ ...prev, thingsToDo: updated }));
  };
  const handleThingsToDoDescriptionChange = (i, value) => {
    const updated = [...formData.thingsToDo];
    updated[i].description = value;
    setFormData((prev) => ({ ...prev, thingsToDo: updated }));
  };
  const handleThingsToDoImage = (i, file) => {
    const updated = [...formData.thingsToDo];
    updated[i].image = file;
    setFormData((prev) => ({ ...prev, thingsToDo: updated }));
  };
  const addThingsToDo = () => {
    setFormData((prev) => ({
      ...prev,
      thingsToDo: [...prev.thingsToDo, { title: "", description: "", image: null }],
    }));
  };
  const removeThingsToDo = (i) => {
    const updated = [...formData.thingsToDo];
    updated.splice(i, 1);
    setFormData((prev) => ({ ...prev, thingsToDo: updated }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("address", formData.address);
      data.append("travelStyles", JSON.stringify(formData.travelStyles));

     
      formData.images.forEach((img) => {
        if (img instanceof File) data.append("images", img);
      });

 
      const topAttractionsPayload = formData.topAttractions.map((a) => ({ name: a.name }));
      data.append("topAttractions", JSON.stringify(topAttractionsPayload));
      formData.topAttractions.forEach((a) => {
        if (a.image instanceof File) data.append("attractionImages", a.image);
      });

     
      const thingsToDoPayload = formData.thingsToDo.map((t) => ({
        title: t.title,
        description: t.description,
      }));
      data.append("thingsToDo", JSON.stringify(thingsToDoPayload));
      formData.thingsToDo.forEach((t) => {
        if (t.image instanceof File) data.append("thingsToDoImages", t.image);
      });

      const config = { headers: { Authorization: `Bearer ${token}` } };

      let res;
      if (editPlace) {
        res = await axios.put(`${API_URL}/${editPlace._id}`, data, config);
        setMessage({ type: "success", text: "Place updated successfully!" });
      } else {
        res = await axios.post(API_URL, data, config);
        setMessage({ type: "success", text: "Place added successfully!" });
      }

      setFormVisible(false);
      setEditPlace(null);
      setFormData({
        name: "",
        description: "",
        address: "",
        images: [],
        travelStyles: [],
        topAttractions: [{ name: "", image: null, existingImage: "" }],
        thingsToDo: [{ title: "", description: "", image: null, existingImage: "" }],
      });

      fetchPlaces();
    } catch (err) {
      console.error("Submit error:", err);
      setMessage({ type: "error", text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  
  const handleEdit = (place) => {
    setEditPlace(place);
    setFormData({
      name: place.name,
      description: place.description,
      address: place.address,
      images: [],
      travelStyles: place.travelStyles || [],
      topAttractions: (place.topAttractions || []).map((a) => ({
        name: a.name,
        image: null,
        existingImage: a.image || "",
      })),
      thingsToDo: (place.thingsToDo || []).map((t) => ({
        title: t.title,
        description: t.description || "",
        image: null,
        existingImage: t.image || "",
      })),
    });
    setFormVisible(true);
  };

 
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
      console.error("Delete error:", err);
      setMessage({ type: "error", text: "Failed to delete place" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Places</h2>

      {message && (
        <p
          className={`mb-2 p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        onClick={() => setFormVisible(!formVisible)}
        className="mb-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
      >
        {formVisible ? "Close Form" : editPlace ? "Edit Selected Place" : "Add New Place"}
      </button>

      {formVisible && (
        <PlaceForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handlePlaceImages={handlePlaceImages}
          handleAttractionChange={handleAttractionChange}
          handleAttractionImage={handleAttractionImage}
          addAttraction={addAttraction}
          removeAttraction={removeAttraction}
          handleThingsToDoChange={handleThingsToDoChange}
          handleThingsToDoDescriptionChange={handleThingsToDoDescriptionChange}
          handleThingsToDoImage={handleThingsToDoImage}
          addThingsToDo={addThingsToDo}
          removeThingsToDo={removeThingsToDo}
          handleSubmit={handleSubmit}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center my-4">
          <Loader />
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Travel Styles</th>
              <th className="border p-2">Top Attractions</th>
              <th className="border p-2">Things To Do</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place._id} className="text-center hover:bg-gray-100 cursor-pointer">
                <td className="border p-2">{place.name}</td>
                <td className="border p-2">{place.address}</td>
                <td className="border p-2">{(place.travelStyles || []).join(", ")}</td>
                <td className="border p-2">{(place.topAttractions || []).map((a) => a.name).join(", ")}</td>
                <td className="border p-2">{(place.thingsToDo || []).map((t) => t.title).join(", ")}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(place)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(place._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagePlaces;
