// src/components/admin/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Users, Building2, BarChart2, Lightbulb, MapPin, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ onLogout }) => {
  const { user } = useAuth();

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
        <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin/manage-user" className={linkClasses}>
          <Users size={20} />  Users
        </NavLink>
        <NavLink to="/admin/manage-agencies" className={linkClasses}>
          <Building2 size={20} /> Agencies
        </NavLink>
        <NavLink to="/admin/manage-places" className={linkClasses}>
          <MapPin size={20} /> Places
        </NavLink>
        <NavLink to="/admin/manage-recommendation" className={linkClasses}>
          <Lightbulb size={20} /> Recommendation
        </NavLink>
        <NavLink to="/admin/manage-blogs" className={linkClasses}>
          <Lightbulb size={20} /> Blogs
        </NavLink>
        <NavLink to="/admin/overview" className={linkClasses}>
          <BarChart2 size={20} /> Overview
        </NavLink>
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 cursor-pointer transition"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
