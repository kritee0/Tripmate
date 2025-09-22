import React from "react";

const AgencyTravelpackageCard = ({ pkg, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition">
     
      {pkg.image ? (
        <img
          src={`http://localhost:4000${pkg.image}`}
          alt={pkg.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}

   
      <div className="p-3">
        <h3 className="text-md font-bold truncate">{pkg.title}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {pkg.description}
        </p>

     
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-semibold text-sm">
            Rs. {pkg.prices}
          </span>
          <span className="text-gray-500 text-xs">{pkg.duration}</span>
        </div>

        
        {pkg.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {pkg.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => onEdit(pkg)}
            className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer  hover:bg-blue-600"
          > 
            Edit
          </button>
          <button
            onClick={() => onDelete(pkg._id)}
            className="bg-red-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyTravelpackageCard;

