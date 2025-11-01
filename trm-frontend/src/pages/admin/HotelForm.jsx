import { Trash } from "lucide-react";
import { useState } from "react";

const HotelForm = ({ formData, setFormData, handleSubmit, places }) => {
  console.log("helo world", formData);
  const fileTypes = ".jpg,.jpeg,.png";
  const [contactError, setContactError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact") {
      if (!/^\d{0,10}$/.test(value)) return;
      setContactError(value.length === 10 ? "" : "Contact must be 10 digits");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleArrayChange = (key, index, value) => {
    const updated = [...formData[key]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const addArrayItem = (key) => {
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  };

  const removeArrayItem = (key, index) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Place */}
          <div>
            <label className="block font-medium mb-1">Select Place *</label>
            <select
              name="placeId"
              value={formData.placeId}
              onChange={handleInputChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Select a Place</option>
              {places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hotel Name */}
          <div>
            <label className="block font-medium mb-1">Hotel Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows={4}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Location (Lat & Long) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Latitude *</label>
              <input
                type="number"
                step="any"
                name="lat"
                value={formData.lat || ""}
                onChange={handleInputChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. 27.7172"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Longitude *</label>
              <input
                type="number"
                step="any"
                name="long"
                value={formData.long || ""}
                onChange={handleInputChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. 85.3240"
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium mb-1">
              Contact (10 digits) *
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className={`border p-2 w-full rounded focus:outline-none focus:ring-2 ${
                contactError ? "focus:ring-red-400" : "focus:ring-blue-300"
              }`}
              required
            />
            {contactError && (
              <p className="text-red-500 text-sm">{contactError}</p>
            )}
          </div>

          {/* Price Range */}
          <div>
            <label className="block font-medium mb-1">Price Range *</label>
            <input
              type="text"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleInputChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Amenities */}
          <div>
            <label className="block font-medium mb-1">Amenities</label>
            {formData.amenities.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("amenities", idx, e.target.value)
                  }
                  className="border p-1 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("amenities", idx)}
                  className="text-red-500"
                >
<Trash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("amenities")}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Add Amenity
            </button>
          </div>

          {/* Room Features */}
          <div>
            <label className="block font-medium mb-1">Room Features</label>
            {formData.roomFeatures.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("roomFeatures", idx, e.target.value)
                  }
                  className="border p-1 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("roomFeatures", idx)}
                  className="text-red-500"
                >
                  <Trash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("roomFeatures")}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Add Feature
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Hotel Image *</label>
            <input
              type="file"
              accept={fileTypes}
              onChange={handleFileChange}
              required={!formData.image}
              className="block w-full text-sm"
            />
            {formData.image && (
              <div className="w-40 h-40 mt-3 overflow-hidden rounded border">
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : `http://localhost:4000${formData.image}`
                  }
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={contactError}
        >
          Save Hotel
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
