import React from "react";
import { BrowserRouter } from "react-router-dom";
import PageRoutes from "./routes/pageRoutes";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen flex flex-col">
          <main className="flex-1 w-full flex flex-col">
            <PageRoutes />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;




