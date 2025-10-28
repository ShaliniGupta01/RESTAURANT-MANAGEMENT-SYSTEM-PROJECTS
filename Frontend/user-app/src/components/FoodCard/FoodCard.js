import React from "react";
import "./FoodCard.css";

export default function FoodCard({ item, qty, onChangeQty }) {
  const BASE_URL = "http://localhost:5000";

  //  Build full image path safely
  const imageSrc = item?.image
    ? item.image.startsWith("http")
      ? item.image
      : `${BASE_URL}${item.image.startsWith("/") ? item.image : "/" + item.image}`
    : "/default-food.png";

  return (
    <div className="food-card">
      {/*  Food Image */}
      <div className="food-image">
        <img
          src={imageSrc}
          alt={item.name || "Food"}
          onError={(e) => (e.target.src = "/default-food.png")}
        />
      </div>

      {/*  Food Details */}
      <div className="food-body">
        <div className="food-title">{item.name}</div>

        <div className="food-sub">
          <div className="food-price">₹{item.price}</div>

          <div className="food-actions">
            {qty > 0 ? (
              <>
                <button className="btn-qty" onClick={() => onChangeQty(item, -1)}>
                  -
                </button>
                <span className="qty">{qty}</span>
                <button className="btn-qty" onClick={() => onChangeQty(item, +1)}>
                  +
                </button>
              </>
            ) : (
              <button className="btn-add" onClick={() => onChangeQty(item, +1)}>
                ＋
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
