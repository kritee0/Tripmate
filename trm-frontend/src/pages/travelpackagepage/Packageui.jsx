import React, { useState, useEffect } from "react";
import api from "../../utils/apiUtiles";
import PackageCard from "../../components/travelpackage/PackageCard";

const PackagesUI = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/packages");
        if (res.data.success) {
          const fetchedPackages = res.data.data || [];
          setPackages(fetchedPackages);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(fetchedPackages.map((pkg) => pkg.category))
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  // Filter packages based on active category
  const filteredPackages =
    activeFilter === "All"
      ? packages
      : packages.filter((pkg) => pkg.category === activeFilter);

  const handlePackageClick = (pkg) => {
    console.log("Clicked package:", pkg);
    // Navigate to detail page or open modal here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {/* All Packages Button */}
              <button
                onClick={() => setActiveFilter("All")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeFilter === "All"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>All Packages</span>
                  <span className="text-sm text-gray-500">{packages.length}</span>
                </div>
              </button>

              {/* Category Buttons */}
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-sm text-gray-500">
                      {packages.filter((pkg) => pkg.category === cat).length}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} onClick={handlePackageClick} />
          ))
        ) : (
          <p className="text-gray-500">No packages found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default PackagesUI;

