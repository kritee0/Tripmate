import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Bell } from "lucide-react";

const NavBarLoggedIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleSearchChange = (e) => setQuery(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const links = [
    { label: "Home", path: "/Homepage" },
    { label: "Travel Journey", path: "/journey" },
    { label: "Travel Packages", path: "/packages" },
    { label: "Explore", path: "/explore" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md text-gray-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <h1
            onClick={() => navigate("/Homepage")}
            className="text-2xl font-bold text-green-900 cursor-pointer"
          >
            TripMate
          </h1>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Search your destination..."
              value={query}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition duration-200 w-96"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 rounded-full bg-green-800 text-white hover:bg-green-900 transition"
            >
              Search
            </button>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 ml-6">
            {links.map((link) => (
              <div
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`cursor-pointer font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-green-700"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.label}
              </div>
            ))}
          </div>

          {/* Notifications & Logout */}
          <div className="flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <Bell className="w-6 h-6 text-green-700 cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white z-50 max-h-96 overflow-y-auto shadow-lg rounded-lg">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n._id}
                        className={`px-4 py-3 text-sm border-b last:border-none ${
                          n.isRead ? "bg-gray-50" : "bg-green-50"
                        }`}
                      >
                        {n.message}
                        {n.link && (
                          <button
                            onClick={() => navigate(n.link)}
                            className="ml-2 text-green-600 hover:underline"
                          >
                            View
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
                  )}
                  <button
                    onClick={() => navigate("/notifications")}
                    className="w-full text-center text-green-600 py-2 hover:bg-gray-50"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition duration-300 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Push down page content so it doesn't go under navbar */}
      <div className="pt-0"></div>
    </>
  );
};

export default NavBarLoggedIn;
