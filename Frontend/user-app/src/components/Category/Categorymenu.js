import React from "react";
import "./Categorymenu.css";
import {
  FaHamburger,
  FaPizzaSlice,
  FaGlassWhiskey,
  FaCarrot,
  FaUtensils,
} from "react-icons/fa";

export default function Categorymenu({ categories = [], selected, onSelect }) {
  // Map category names to icons
  const icons = {
    Burger: <FaHamburger size={20} />,
    Pizza: <FaPizzaSlice size={20} />,
    Drink: <FaGlassWhiskey size={20} />,
    "French fries": <FaUtensils size={20} />,
    Veggies: <FaCarrot size={20} />,
    Default: <FaUtensils size={20} />,
  };

  return (
    <div className="cat-tabs">
      {categories.length > 0 ? (
        categories.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${selected === cat ? "active" : ""}`}
            onClick={() => onSelect(cat)}
          >
            <div className="cat-icon">
              {/*  fallback icon for unknown categories */}
              {icons[cat] || icons.Default}
            </div>
            <span className="cat-label">{cat}</span>
          </button>
        ))
      ) : (
        <p className="no-category">No categories found</p>
      )}
    </div>
  );
}
