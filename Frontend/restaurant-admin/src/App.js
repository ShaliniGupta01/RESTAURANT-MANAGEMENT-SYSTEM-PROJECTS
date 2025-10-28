

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Analytics from "./pages/Analytics/Analytics";
import Tables from "./pages/Tables";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* Header at the top */}
      <Header />

      {/* Sidebar and content section */}
      <div className="body-section">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <main className="content-area">
          <Routes>
            {/* Redirect root path to /analytics */}
            <Route path="/" element={<Navigate to="/analytics" replace />} />

            {/* Page routes */}
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/add-product" element={<AddProduct />} />

            {/* Fallback route */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
