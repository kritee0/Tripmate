import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
      {children}
    </div>
  );
};

export default AuthLayout;

