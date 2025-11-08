import React, { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import "./Cart.css";

export default function Cart({ cart, user, orderType, onPlaceOrder }) {
  const [swiped, setSwiped] = useState(false);
  const sliderRef = useRef(null);

  const handleOrder = () => {
    if (!swiped) {
      setSwiped(true);
      onPlaceOrder?.();
      setTimeout(() => setSwiped(false), 1500);
    }
  };

  const handlers = useSwipeable({
    onSwipedRight: handleOrder,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const itemsTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
  const delivery = orderType === "Take Away" ? 50 : 0;
  const taxes = 5;
  const grandTotal = itemsTotal + delivery + taxes;

  return (
    <div className="summary-card">
      {/* ------ PRICE SECTION ------ */}

      <div className="price-section">
        <div className="row">
          <span>Item Total</span>
          <span>₹{itemsTotal.toFixed(2)}</span>
        </div>

        {orderType === "Take Away" && (
          <div className="row delivery">
            <span>Delivery Charge</span>
            <span>₹{delivery.toFixed(2)}</span>
          </div>
        )}

        <div className="row">
          <span>Taxes</span>
          <span>₹{taxes.toFixed(2)}</span>
        </div>

        <div className="row total">
          <strong>Grand Total</strong>
          <strong>₹{grandTotal.toFixed(2)}</strong>
        </div>
      </div>

      {/* ------ YOUR DETAILS SECTION ------ */}
      <div className="your-details">
        <div className="yd-title">Your details</div>
        <div className="yd-info">
          {user?.name} • {user?.phone}
        </div>

        <div className="user-line" />

        {orderType === "Take Away" ? (
          <div className="yd-extra">
            <div className="yd-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-green"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                Delivery at Home — {user?.address || "Fetching location..."}
              </span>
            </div>

            <div className="yd-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-green"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                Delivery in <strong>42 mins</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="yd-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon-green"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7" />
              <path d="M12 12V3" />
              <path d="M8 3h8" />
            </svg>
            <span>Dining in restaurant</span>
          </div>
        )}
      </div>

      {/* ------ SWIPE TO ORDER ------ */}
      <div
        className="swipe-track"
        {...handlers}
        ref={sliderRef}
        onClick={handleOrder}
      >
        <div className={`swipe-thumb ${swiped ? "swiped" : ""}`}>➡</div>
        <span className={`swipe-text ${swiped ? "done" : ""}`}>
          {swiped ? "Order Placed!" : "Swipe to Order"}
        </span>
      </div>
    </div>
  );
}
