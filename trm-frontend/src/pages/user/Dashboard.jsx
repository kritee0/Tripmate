import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, isAgency } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
     
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold text-green-900 mb-4">
          Welcome, {user?.name || "Traveler"} 
        </h1>
        <p className="text-green-700">
          {isAgency
            ? user.isVerifiedAgency
              ? "Manage your agency profile and travel packages."
              : "Your agency application is under review."
            : "Explore destinations, search packages, and plan your next trip."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      
        <div
          className="bg-white p-6 rounded-2xl shadow-md text-center cursor-pointer
                     transition duration-300 hover:shadow-lg hover:border hover:border-green-400 hover:animate-pulse"
        >
          <h2 className="text-xl font-bold mb-3 text-green-900">
            Continue as Traveler
          </h2>
          <p className="text-green-900 mb-4">
            Explore destinations, search packages, and book your next trip.
          </p>
          <button
            onClick={() => navigate("/homepage")}
            className="px-5 py-2 bg-green-900 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 active:scale-95"
          >
            Start Exploring
          </button>
        </div>

        <div
          className="bg-white p-6 rounded-2xl shadow-md text-center cursor-pointer
                     transition duration-300 hover:shadow-lg hover:border hover:border-green-400 hover:animate-pulse"
        >
          <h2 className="text-xl font-bold mb-3 text-green-900">Travel Agency</h2>

          {isAgency ? (
            user.isVerifiedAgency ? (
              <button
                onClick={() => navigate("/dashboard/agency")}
                className="px-5 py-2 bg-green-900 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 active:scale-95"
              >
                Go to Agency Dashboard
              </button>
            ) : (
              <p className="text-green-600"> Your agency application is under review.</p>
            )
          ) : (
            <>
              <p className="text-green-700 mb-4">
                Want to host tours? Apply today and become one of our{" "}
                <span className="text-green-600 font-medium">trusted travel partners</span>.
              </p>
              <button
                onClick={() => navigate("/dashboard/agency/form")}
                className="px-5 py-2 bg-green-900 text-white font-semibold rounded-full hover:bg-green-800 transition duration-300 active:scale-95"
              >
                Apply as an Agency
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


