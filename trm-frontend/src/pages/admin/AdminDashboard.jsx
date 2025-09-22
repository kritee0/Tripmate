import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Users, Building2, Lightbulb, BarChart2, LogOut, MapPin } from "lucide-react";
import TopBar from "../../components/admin/Topbar";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

 
  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="flex h-screen w-full bg-gray-100">
     
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin/manage-user" className={linkClasses}>
            <Users size={20} />
            Manage Users
          </NavLink>

          <NavLink to="/admin/manage-agencies" className={linkClasses}>
            <Building2 size={20} />
            Manage Agencies
          </NavLink>

          <NavLink to="/admin/manage-places" className={linkClasses}>
            <MapPin size={20} />
            Manage Places
          </NavLink>

            <NavLink to="/admin/manage-recommendation" className={linkClasses}>
            <Lightbulb size={20} />
            Manage-Recommendation
          </NavLink>

          <NavLink to="/admin/overview" className={linkClasses}>
            <BarChart2 size={20} />
           AdminOverview
          </NavLink>
        </nav>

        <button
          onClick={handleLogout} 
          className="flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 cursor-pointer transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

     
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 w-full bg-gray-50 overflow-y-auto">
          <div className="p-6 min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


