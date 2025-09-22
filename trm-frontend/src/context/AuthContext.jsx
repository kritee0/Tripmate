import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/apiUtiles"; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   
  const [loading, setLoading] = useState(true);


  const getMyProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      if (res.data.success) {
        setUser({
          ...res.data.data,
          role: res.data.data.role || "User",
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(" Error fetching profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  const login = async (loginResponse) => {
    if (loginResponse?.token) {
      localStorage.setItem("token", loginResponse.token);
      setUser({
        ...loginResponse.user,
        role: loginResponse.user?.role || "User",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "User",
        isAdmin: user?.role === "Admin",
        isAgency: user?.role === "TravelAgency",
        isUser: user?.role === "User",
        setUser,
        loading,
        getMyProfile,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };


