// src/components/admin/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Building2,
  BarChart2,
  Lightbulb,
  MapPin,
  LogOut,
  Home,
} from "lucide-react"; 
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ onLogout, closeSidebar }) => {
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };
  const handleCancelLogout = () => setShowLogoutModal(false);

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  return (
    <>
      <aside className="w-64 bg-white   flex flex-col  z-30 md:relative md:translate-x-0 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink onClick={handleLinkClick} to="/admin/overview" className={linkClasses}>
            <BarChart2 size={20} /> Overview
          </NavLink>
          <NavLink onClick={handleLinkClick} to="/admin/manage-user" className={linkClasses}>
            <Users size={20} /> Users
          </NavLink>
          <NavLink onClick={handleLinkClick} to="/admin/manage-agencies" className={linkClasses}>
            <Building2 size={20} /> Agencies
          </NavLink>
          <NavLink onClick={handleLinkClick} to="/admin/manage-places" className={linkClasses}>
            <MapPin size={20} /> Places
          </NavLink>
          <NavLink onClick={handleLinkClick} to="/admin/manage-hotels" className={linkClasses}>
            <Home size={20} /> Hotels
          </NavLink>
          <NavLink onClick={handleLinkClick} to="/admin/manage-recommendation" className={linkClasses}>
            <Lightbulb size={20} /> Recommendation
          </NavLink>
          <NavLink onClick={handleLinkClick} to="/admin/manage-blogs" className={linkClasses}>
            <Lightbulb size={20} /> Blogs
          </NavLink>
        </nav>

        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 cursor-pointer transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-80 max-w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-900 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
