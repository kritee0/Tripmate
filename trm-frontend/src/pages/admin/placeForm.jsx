import React from "react";

const PlaceForm = ({
  formData,
  setFormData,
  handleInputChange,
  handlePlaceImages,
  handleAttractionChange,
  handleAttractionImage,
  addAttraction,
  removeAttraction,
  handleThingsToDoChange,
  handleThingsToDoDescriptionChange,
  handleThingsToDoImage,
  addThingsToDo,
  removeThingsToDo,
  handleSubmit,
}) => {
  const travelStyleOptions = ["Food", "Adventure", "Temple", "City"];
  const allowedFileTypes = ".jpeg,.jpg,.png,.pdf";

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6 bg-gray-50">
   
      <input
        type="text"
        name="name"
        placeholder="Place Name"
        value={formData.name}
        onChange={handleInputChange}
        className="border p-2 w-full mb-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        className="border p-2 w-full mb-2 rounded"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleInputChange}
        className="border p-2 w-full mb-2 rounded"
        required
      />

    
      <div className="mb-2">
        <label className="block font-medium">Travel Styles</label>
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
                      travelStyles: prev.travelStyles.filter((s) => s !== style),
                    }));
                  }
                }}
              />
              {style}
            </label>
          ))}
        </div>
      </div>

    
      <div className="mb-2">
        <label className="block font-medium">Place Images (max 5)</label>
        <input
          type="file"
          multiple
          accept={allowedFileTypes}
          onChange={handlePlaceImages}
        />
        {formData.images.length > 0 && (
          <p className="text-sm text-gray-600">{formData.images.length} selected</p>
        )}
      </div>
      <h3 className="text-lg font-semibold mt-4">Top Attractions (max 5)</h3>
      <div className="flex gap-4 overflow-x-auto py-2">
        {formData.topAttractions.map((attr, i) => (
          <div
            key={i}
            className="min-w-[160px] flex-shrink-0 rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 bg-white"
          >
            <div className="w-full h-32 overflow-hidden rounded-t-xl">
              {attr.image || attr.existingImage ? (
                <img
                  src={
                    attr.image
                      ? URL.createObjectURL(attr.image)
                      : attr.existingImage
                  }
                  alt={attr.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-2 text-center">
              <input
                type="text"
                placeholder="Attraction Name"
                value={attr.name}
                onChange={(e) => handleAttractionChange(i, e.target.value)}
                className="border p-1 rounded w-full text-sm mb-1"
                required
              />
              <input
                type="file"
                accept={allowedFileTypes}
                onChange={(e) => handleAttractionImage(i, e.target.files[0])}
                className="text-xs"
              />
              <button
                type="button"
                onClick={() => removeAttraction(i)}
                className="mt-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {formData.topAttractions.length < 5 && (
          <button
            type="button"
            onClick={addAttraction}
            className="min-w-[160px] flex-shrink-0 bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-green-600"
          >
            + Add Attraction
          </button>
        )}
      </div>

   
      <h3 className="text-lg font-semibold mt-4">Things To Do (max 5)</h3>
      <div className="flex gap-4 overflow-x-auto py-2">
        {formData.thingsToDo.map((todo, i) => (
          <div
            key={i}
            className="min-w-[160px] flex-shrink-0 rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 bg-white"
          >
            <div className="w-full h-32 overflow-hidden rounded-t-xl">
              {todo.image || todo.existingImage ? (
                <img
                  src={
                    todo.image ? URL.createObjectURL(todo.image) : todo.existingImage
                  }
                  alt={todo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-2 text-center">
              <input
                type="text"
                placeholder="Activity Title"
                value={todo.title}
                onChange={(e) => handleThingsToDoChange(i, e.target.value)}
                className="border p-1 rounded w-full text-sm mb-1"
                required
              />
              <textarea
                placeholder="Description"
                value={todo.description}
                onChange={(e) => handleThingsToDoDescriptionChange(i, e.target.value)}
                className="border p-1 rounded w-full text-sm mb-1"
              />
              <input
                type="file"
                accept={allowedFileTypes}
                onChange={(e) => handleThingsToDoImage(i, e.target.files[0])}
                className="text-xs"
              />
              <button
                type="button"
                onClick={() => removeThingsToDo(i)}
                className="mt-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {formData.thingsToDo.length < 5 && (
          <button
            type="button"
            onClick={addThingsToDo}
            className="min-w-[160px] flex-shrink-0 bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-green-600"
          >
            + Add Thing To Do
          </button>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
      >
        Save Place
      </button>
    </form>
  );
};

export default PlaceForm;








