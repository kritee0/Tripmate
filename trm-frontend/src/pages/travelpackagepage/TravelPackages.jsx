import React, { useState, useEffect } from "react";
import axios from "axios";
import PackageCard from "../../components/travelpackage/PackageCard";
import PackageDetails from "./PackageDetail"
import PackageSidebar from "./Packageui";

const TravelPackages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" or "details"

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/packages");
        setPackages(res.data.data || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleCardClick = (pkg) => {
    setSelectedPackage(pkg);
    setView("details");
  };

  const handleBack = () => {
    setSelectedPackage(null);
    setView("list");
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {loading ? (
        <p className="text-center text-gray-600">Loading packages...</p>
      ) : view === "list" ? (
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-20">
              <PackageSidebar />
            </div>
          </div>

          {/* Packages Grid */}
          <div className="flex-1">
            {packages.length === 0 ? (
              <p className="text-center text-gray-600">No travel packages available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg._id}
                    pkg={pkg}
                    onClick={() => handleCardClick(pkg)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Details View
        <PackageDetails pkg={selectedPackage} onBack={handleBack} />
      )}
    </div>
  );
};

export default TravelPackages;




