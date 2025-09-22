import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
 
        <h1
          className="text-2xl font-bold text-green-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          TripMate
        </h1>

        <input
          type="text"
          placeholder="Search your destination..."
          className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 w-full md:w-[300px]"
        />

      
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <div
            className="hover:text-green-600 cursor-pointer font-medium"
            onClick={() => navigate('/')}
          >
            Home
          </div>

          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300"
          >
            Register
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full border border-green-600 text-green-600 font-semibold hover:bg-green-50 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


