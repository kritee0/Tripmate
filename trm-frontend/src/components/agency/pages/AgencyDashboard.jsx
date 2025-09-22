
// src/pages/agency/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../tool/SideBar"; // import sidebar
import { Calendar, Package, Users } from "lucide-react";
import api from "../../../utils/apiUtiles";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalPackages: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsRes = await api.get("/agencies/bookings");
        const bookings = bookingsRes.data?.data || [];
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(
          (b) => b.status.toLowerCase() === "pending"
        ).length;

        const packagesRes = await api.get("/agencies/packages");
        const packages = packagesRes.data?.data || [];
        const totalPackages = packages.length;

        setStats({ totalBookings, totalPackages, pendingBookings });
      } catch (err) {
        console.error("Error fetching stats:", err.response?.data || err.message);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Travel Packages",
      value: stats.totalPackages,
      icon: <Package className="h-6 w-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: <Users className="h-6 w-6 text-yellow-600" />,
      color: "bg-yellow-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Welcome back!</h2>
          <p className="text-gray-500 text-sm">
            Here’s the latest overview of your travel agency.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">{item.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${item.color}`}>{item.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
