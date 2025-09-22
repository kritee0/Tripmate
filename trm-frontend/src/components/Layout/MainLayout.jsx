import React from "react";
import Navbar from "../common/Navbar1";
import Footer from "../common/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <main className="flex-grow pt-20"> {/* Add top padding equal to navbar height */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;




