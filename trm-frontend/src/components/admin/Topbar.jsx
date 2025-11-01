import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3">
      {/* Left: Logo + Menu toggler for mobile */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>
        )}
        <span className="text-lg font-bold text-blue-600">TripMate</span>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-6">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || "A"}&background=0D8ABC&color=fff`}
            alt="User avatar"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-gray-700 font-medium">{user?.name || "Admin"}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
