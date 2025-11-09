import React from "react";
import "./MenuCard.css";

export default function MenuCard({ item }) {
  const backendURL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://restaurant-backend-1rky.onrender.com";

  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `${backendURL}${
          item.image.startsWith("/") ? item.image : "/" + item.image
        }`
    : "/placeholder.png";

  <img
    src={imageUrl}
    alt={item.name}
    onError={(e) => (e.target.src = "/placeholder.png")}
  />;

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={item.name} />
      </div>

      <div className="product-details">
        <p>
          <strong>Name:</strong> {item.name}
        </p>
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>Price:</strong> ₹{item.price}
        </p>
        <p>
          <strong>Average Prep Time:</strong> {item.averagePreparationTime}
        </p>
        <p>
          <strong>Category:</strong> {item.category}
        </p>

        {/* Show stock line only when stock > 0 */}
        {item.stock > 0 && (
          <p>
            <strong>Stock:</strong> Yes
          </p>
        )}

        {/* Show rating if it exists */}
        {item.rating && (
          <p>
            <strong>Rating:</strong> {item.rating} ⭐
          </p>
        )}
      </div>
    </div>
  );
}
