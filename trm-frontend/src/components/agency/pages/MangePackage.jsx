import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../tool/SideBar"; // adjust path
import PackageForm from "./PackageForm";

const ManagePackage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/packages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPackages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(packages.filter((p) => p._id !== id));
      if (selectedPackage?._id === id) setSelectedPackage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleRowClick = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleCreateClick = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 sticky top-0 h-screen bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center bg-white shadow rounded-lg p-4 mb-4 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Travel Packages</h2>
          <button
            onClick={handleCreateClick}
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold shadow flex items-center gap-2"
          >
            + Create Package
          </button>
        </div>

        {/* Package Form */}
        {showForm && (
          <div className="relative mb-4">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-800 text-xl font-bold z-20"
            >
              ×
            </button>
            <PackageForm
              editingPackage={editingPackage}
              onSuccess={() => {
                fetchPackages();
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Packages Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.length > 0 ? (
                packages.map((pkg, idx) => (
                  <tr
                    key={pkg._id}
                    className={`cursor-pointer ${idx % 2 === 0 ? "bg-gray-50" : ""}`}
                    onClick={() => handleRowClick(pkg)}
                  >
                    <td className="px-6 py-4">{pkg.name}</td>
                    <td className="px-6 py-4">{pkg.location}</td>
                    <td className="px-6 py-4">Rs. {pkg.price}</td>
                    <td className="px-6 py-4">{pkg.duration}</td>
                    <td className="px-6 py-4">{pkg.category}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(pkg);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pkg._id);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No packages available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Package Details */}
        {selectedPackage && (
          <div className="relative mt-6 p-4 bg-white shadow rounded-lg">
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-2">{selectedPackage.name}</h3>
            <p className="mb-2">{selectedPackage.overview}</p>

            <div className="grid grid-cols-2 gap-4">
              <p><strong>Location:</strong> {selectedPackage.location}</p>
              <p><strong>Category:</strong> {selectedPackage.category}</p>
              <p><strong>Price:</strong> Rs. {selectedPackage.price}</p>
              <p><strong>Duration:</strong> {selectedPackage.duration}</p>
              <p><strong>Transport on Arrival:</strong> {selectedPackage.transportAvailableOnArrival ? "Yes" : "No"}</p>
            </div>

            {/* Highlights */}
            {selectedPackage.highlights?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Highlights:</h4>
                <ul className="list-disc ml-5">
                  {selectedPackage.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policy */}
            {selectedPackage.policy && (
              <div className="mt-4">
                <h4 className="font-semibold">Policy:</h4>
                {selectedPackage.policy.included?.length > 0 && (
                  <p><strong>Included:</strong> {selectedPackage.policy.included.join(", ")}</p>
                )}
                {selectedPackage.policy.excluded?.length > 0 && (
                  <p><strong>Excluded:</strong> {selectedPackage.policy.excluded.join(", ")}</p>
                )}
                {selectedPackage.policy.cancellation && (
                  <p><strong>Cancellation:</strong> {selectedPackage.policy.cancellation}</p>
                )}
                {selectedPackage.policy.payment && (
                  <p><strong>Payment:</strong> {selectedPackage.policy.payment}</p>
                )}
              </div>
            )}

            {/* Itinerary */}
            {selectedPackage.itinerary?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Itinerary:</h4>
                <ul className="list-disc ml-5 space-y-2">
                  {selectedPackage.itinerary.map((day) => (
                    <li key={day.day}>
                      <p><strong>Day {day.day}:</strong> {day.title}</p>
                      {day.activities?.length > 0 && <p>Activities: {day.activities.join(", ")}</p>}
                      {day.meals?.length > 0 && <p>Meals: {day.meals.join(", ")}</p>}
                      {day.accommodation && <p>Accommodation: {day.accommodation}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agency */}
            {selectedPackage.agency && (
              <div className="mt-4">
                <h4 className="font-semibold">Agency Overview:</h4>
                <p><strong>Name:</strong> {selectedPackage.agency.name}</p>
                <p><strong>Location:</strong> {selectedPackage.agency.location}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePackage;










