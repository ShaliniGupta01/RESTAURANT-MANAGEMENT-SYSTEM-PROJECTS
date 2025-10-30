

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
      <Header />
      <div className="body-section">
        <Sidebar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/analytics" replace />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

