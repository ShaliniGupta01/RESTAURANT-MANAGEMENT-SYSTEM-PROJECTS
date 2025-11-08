import React from "react";
import "./Categorymenu.css";

// Import PNG images
import burgerImg from "../../Assets/Bug.png";
import pizzaImg from "../../Assets/pizz.png";
import drinkImg from "../../Assets/dk.png";
import friesImg from "../../Assets/veg.png";
import veggiesImg from "../../Assets/vgg.png";

export default function Categorymenu({ categories = [], selected, onSelect }) {
  const icons = {
    Burger: burgerImg,
    Pizza: pizzaImg,
    Drink: drinkImg,
    "French fries": friesImg,
    Veggies: veggiesImg,
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
              <img src={icons[cat]} alt={cat} className="cat-img" />
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
