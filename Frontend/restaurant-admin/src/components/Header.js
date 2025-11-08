import React from "react";
import "./Header.css";
import logo from "../Assets/rest.jpg";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "react-router-dom";


export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();

  //Show the search bar on Analytics and Add Product page
   const showSearch =
    location.pathname === "/analytics" ||
    location.pathname === "/admin-menu" ||
    location.pathname === "/" ||
    location.pathname === "/dashboard";


  return (
    <header className="header-bar">
      <div className="header-left">
        <img src={logo} alt="Restaurant Logo" className="header-logo" />
        {showSearch && (
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        )}
      </div>
    </header>
  );
}
