import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("🔎 Login response:", result); 

      if (result?.success) {
        const { user, token } = result.data; 
        if (!token) {
          alert("❌ Token not received from backend!");
          return;
        }

        
        await login({ user, token });

        
        if (user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "TravelAgency") {
          navigate("/dashboard/agency");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(result.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-900">Welcome Back</h2>
          <p className="text-green-700 text-sm">Log in to TripMate</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="w-full p-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            className="w-full p-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition cursor-pointer active:scale-95"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-green-700">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-green-900 hover:underline">
              Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;


