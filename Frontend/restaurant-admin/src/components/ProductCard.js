import React from "react";
import "./ProductCard.css";

export default function ProductCard({ item }) {
  // CRA uses process.env.REACT_APP_...
  const backendURL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://restaurant-backend-1rky.onrender.com";

  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `${backendURL}${item.image}`
    : "/placeholder.png";

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={item.name} />
      </div>

      <div className="product-details">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p>
          <strong>Price:</strong> ₹{item.price}
        </p>
        <p>
          <strong>Category:</strong> {item.category}
        </p>
        <p>
          <strong>Stock:</strong> {item.stock > 0 ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
