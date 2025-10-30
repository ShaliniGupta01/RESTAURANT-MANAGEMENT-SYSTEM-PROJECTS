import React from "react";
import "./Header.css";
import logo from "../Assets/rest.jpg";
import { useSearch } from "../context/SearchContext";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <header className="header-bar">
      <div className="header-left">
        <img src={logo} alt="Restaurant Logo" className="header-logo" />
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
