// src/components/common/Footer.jsx
import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-gray-200 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Tripmate-A travel companion</h2>
          <p className="text-gray-400 text-sm">
            Your companion for planning amazing trips. Explore places, make travel
            journals, and get personalized trip suggestions.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Biratnagar, Nepal
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> tripmate@123.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +977 9801234567
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer transition">Home</li>
            <li className="hover:text-white cursor-pointer transition">Explore</li>
            <li className="hover:text-white cursor-pointer transition">Trips</li>
            <li className="hover:text-white cursor-pointer transition">Community</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TravelMate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
