import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Sidebar.jsx
import TopBar from "../../components/admin/Topbar"; // TopBar
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SidebarWrapper = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100  ">
      {/* Sidebar */}
      <div
        className={`fixed bg-white inset-y-0 left-0 z-30 w-64   transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onLogout={handleLogout} closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right content area */}
      <div className="flex-1 flex flex-col ">
        {/* Top bar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="flex-1 w-full bg-gray-50 overflow-y-scroll">
          {/* Inner wrapper to constrain content width */}
          <div className="p-4   mx-auto min-h-[calc(100vh-64px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarWrapper;
