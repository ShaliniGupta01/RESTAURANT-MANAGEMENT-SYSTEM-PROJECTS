import React from "react";
import "./ProductCard.css";

export default function ProductCard({ item }) {
    return (
        <div className="product-card">
            <div className="product-image">
                {item.image ? (
                    <img
                        src={item.image.startsWith("http") ? item.image : item.image}
                        alt={item.name}
                    />
                ) : (
                    <div className="no-image">Image</div>
                )}
            </div>

            <div className="product-details">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p><strong>Average Prep Time:</strong> {item.averagePreparationTime || "N/A"}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>InStock:</strong> {item.stock > 0 ? "Yes" : "No"}</p>
                <p className="rating">
                    <strong>Rating:</strong> {item.rating || 0} ⭐
                </p>
            </div>
        </div>
    );
}
