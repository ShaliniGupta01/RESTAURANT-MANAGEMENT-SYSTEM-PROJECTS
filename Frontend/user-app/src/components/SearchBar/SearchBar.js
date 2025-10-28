
import React from "react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <img
        src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
        alt="search icon"
        className="search-icon"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        placeholder="Search"
      />
    </div>
  );
}

