import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, address, phoneNumber }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setMessage("Registration successful! Please login.");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(responseData.message || "Registration failed!");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong!");
      setMessageType("error");
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen w-full bg-green-50 flex items-center justify-center p-6">
      {/* Smaller form */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">Join TripMate</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {message && (
            <p
              className={`text-center font-medium ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Two-column input grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-green-800 text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                className="w-full p-2 mt-1 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-green-800 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                className="w-full p-2 mt-1 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-green-800 text-sm font-medium">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                className="w-full p-2 mt-1 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Enter your number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="text-green-800 text-sm font-medium">Address</label>
              <input
                type="text"
                value={address}
                className="w-full p-2 mt-1 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Your location"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Password full width */}
          <div>
            <label className="text-green-800 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              className="w-full p-2 mt-1 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit button half-width and centered */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition cursor-pointer active:scale-95 text-sm"
            >
              Sign Up
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-green-700 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-green-900 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;





