import React from "react";
import Sidebar from "./SideBar" // make sure file is Sidebar.jsx
  // import TopBar
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SidebarWrapper = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Left sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Right content area */}
      <div className="flex-1 flex flex-col">
      
        <main className="flex-1 w-full bg-gray-50 overflow-y-auto">
          <div className="p-6 min-h-[calc(100vh-64px)]">
            {children} {/* Page content goes here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarWrapper;
