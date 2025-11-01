import { Trash } from "lucide-react";

const travelStyleOptions = ["City", "Food", "Temple", "Adventure"];
const seasonOptions = ["Spring", "Summer", "Autumn", "Winter"];
const attractionTypes = ["City", "Adventure", "Temple", "Park", "Museum"];

const PlaceForm = ({ formData, setFormData, handleSubmit }) => {
  const fileTypes = ".jpg,.jpeg,.png";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    setFormData((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleArrayChange = (key, idx, field, value) => {
    const updated = [...formData[key]];
    updated[idx][field] = value;
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleArrayFileChange = (key, idx, file) => {
    const updated = [...formData[key]];
    updated[idx].image = file;
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const removeArrayItem = (key, idx) => {
    const updated = [...formData[key]];
    updated.splice(idx, 1);
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const addArrayItem = (key, newItem = {}) => {
    const updated = formData[key] ? [...formData[key], newItem] : [newItem];
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const sections = [
    {
      key: "topAttractions",
      label: "Top Attractions",
      fields: ["name", "type"],
    },
    {
      key: "thingsToDo",
      label: "Things To Do",
      fields: ["title", "description", "travelStyle"],
    },
    {
      key: "localCulture",
      label: "Local Culture",
      fields: ["festival", "description"],
    },
    {
      key: "localCuisine",
      label: "Local Cuisine",
      fields: ["dish", "description"],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white">
      {/* Basic Info */}
      <div className="mb-2">
        <label className="font-medium block mb-1">Place Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
          required
        />
      </div>

      <div className="mb-2">
        <label className="font-medium block mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
          rows={3}
          required
        />
      </div>

      <div className="mb-2">
        <label className="font-medium block mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
          required
        />
      </div>

      {/* Best Season */}
      <div className="mb-2">
        <label className="font-medium block mb-1">Best Season</label>
        <select
          name="bestSeason"
          value={formData.bestSeason || ""}
          onChange={handleInputChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
        >
          <option value="">Select Season</option>
          {seasonOptions.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="font-medium block mb-1">Travel Tips</label>
        <textarea
          name="travelTips"
          value={formData.travelTips || ""}
          onChange={handleInputChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
          rows={3}
        />
      </div>

      {/* Travel Styles */}
      <div className="mb-2">
        <label className="font-medium block mb-1">Travel Styles</label>
        <div className="flex gap-2 flex-wrap mt-1">
          {travelStyleOptions.map((style) => (
            <label key={style} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={style}
                checked={formData.travelStyles.includes(style)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      travelStyles: [...prev.travelStyles, style],
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      travelStyles: prev.travelStyles.filter(
                        (s) => s !== style
                      ),
                    }));
                  }
                }}
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      {/* Main Place Images */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Place Images</label>
        <input
          type="file"
          multiple
          accept={fileTypes}
          onChange={handleImagesChange}
        />
        {formData.images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.images.map((img, i) => (
              <div key={i} className="w-24 h-24 overflow-hidden rounded border">
                <img
                  src={img instanceof File ? URL.createObjectURL(img) : img}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Sections */}
      {sections.map((section) => (
        <DynamicSection
          key={section.key}
          sectionKey={section.key}
          label={section.label}
          fields={section.fields}
          items={formData[section.key]}
          travelStyleOptions={travelStyleOptions}
          attractionTypes={attractionTypes}
          onChangeItem={(idx, field, value) =>
            handleArrayChange(section.key, idx, field, value)
          }
          onChangeFile={(idx, file) =>
            handleArrayFileChange(section.key, idx, file)
          }
          onAddItem={() => addArrayItem(section.key, {})}
          onRemoveItem={(idx) => removeArrayItem(section.key, idx)}
        />
      ))}

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Save Place
      </button>
    </form>
  );
};

export default PlaceForm;


const DynamicSection = ({
  sectionKey,
  label,
  fields,
  items,
  onChangeItem,
  onChangeFile,
  onAddItem,
  onRemoveItem,
  travelStyleOptions = [],
  attractionTypes = [],
}) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{label}</h3>

      {items.map((item, idx) => (
        <div
          key={idx}
          className="border rounded p-2 mb-2 bg-gray-50 hover:bg-gray-100 transition flex justify-between items-start gap-2"
        >
          {/* Left side: Fields and Image */}
          <div className="flex-1">
            {fields.map((field) => (
              <div className="mb-1" key={field}>
                <label className="font-medium block mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>

                {/* Select for Top Attractions Type */}
                {field === "type" && sectionKey === "topAttractions" && (
                  <select
                    value={item[field] || ""}
                    onChange={(e) => onChangeItem(idx, field, e.target.value)}
                    className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
                  >
                    <option value="">Select Type</option>
                    {attractionTypes.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* Select for Travel Style */}
                {field === "travelStyle" && sectionKey === "thingsToDo" && (
                  <select
                    value={item[field] || ""}
                    onChange={(e) => onChangeItem(idx, field, e.target.value)}
                    className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
                  >
                    <option value="">Select Travel Style</option>
                    {travelStyleOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* Default text input */}
                {!["type", "travelStyle"].includes(field) ||
                sectionKey === "tripPlans" ? (
                  <input
                    type="text"
                    value={item[field] || ""}
                    onChange={(e) => onChangeItem(idx, field, e.target.value)}
                    className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-gray-400 transition"
                  />
                ) : null}
              </div>
            ))}

            {/* Image upload & preview (skip tripPlans) */}
            {sectionKey !== "tripPlans" && (
              <div className="w-full h-32 overflow-hidden rounded-t-xl mb-1">
                <input
                  type="file"
                  onChange={(e) => onChangeFile(idx, e.target.files[0])}
                  className="border p-1 rounded w-full mb-1"
                />
                {item.image || item.existingImage ? (
                  <img
                    src={
                      item.image
                        ? URL.createObjectURL(item.image)
                        : item.existingImage
                    }
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}
          </div>

          {/* Right side: Remove button */}
          <button
            type="button"
            onClick={() => onRemoveItem(idx)}
            className="ml-2 text-red-500 text-xs hover:underline shrink-0"
          >
            <Trash />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddItem}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm transition"
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  );
};
