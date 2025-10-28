import React, { useState, useEffect } from "react";
import { FaUtensils, FaClock, FaCheckCircle } from "react-icons/fa";
import "./OrderCard.css";

export default function OrderCard({ order, onUpdate }) {
  const [status, setStatus] = useState(order?.status || "Ongoing");

  useEffect(() => {
    setStatus(order?.status || "Ongoing");
  }, [order?.status]);

  const isTakeaway = order?.type === "Takeaway" || order?.orderType === "Takeaway";

  const handleProcessingClick = () => {
    setStatus("Served");
    if (onUpdate) onUpdate(order?._id, "Served");
  };

  const getCardClass = () => {
    if (isTakeaway) return "takeaway-card";
    if (status === "Served") return "done-card";
    return "processing-card";
  };

  return (
    <div className={`order-card ${getCardClass()}`}>
      <div className="order-header">
        <div className="left">
          <FaUtensils className="icon" />
          <div>
            <h3>#{order?.orderId || order?._id}</h3>
            <p>
              {isTakeaway ? "Take Away" : "Dine In"}{" "}
              {order?.tableNumber ? `• Table-${order.tableNumber}` : ""}
            </p>
            <p>
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        </div>

        <div
          className={`order-type ${
            isTakeaway
              ? "type-takeaway"
              : status === "Served"
              ? "type-done"
              : "type-processing"
          }`}
        >
          <p className="type-title">
            {isTakeaway ? "Take Away" : "Dine In"}
          </p>
          <p className="type-sub">
            {isTakeaway
              ? "Not Picked Up"
              : status === "Served"
              ? "Served"
              : "Ongoing"}
          </p>
        </div>
      </div>

      <p className="item-count">
        {order?.items?.length || 0} Item{order?.items?.length > 1 ? "s" : ""}
      </p>

      <div className="order-body">
        <div className="order-item">
          {order?.items && order.items.length > 0 ? (
            <ul>
              {order.items.map((it, i) => (
                <li key={i}>
                  {it.quantity} x {it.name || it}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items</p>
          )}
        </div>
      </div>

      {isTakeaway ? (
        <div className="order-footer footer-gray">
          <span>Order Done</span>
          <FaCheckCircle className="done-icon" />
        </div>
      ) : status === "Served" ? (
        <div className="order-footer footer-done">
          <span>Order Done</span>
          <FaCheckCircle className="done-icon" />
        </div>
      ) : (
        <button
          className="order-footer footer-processing"
          onClick={handleProcessingClick}
        >
          <span>Processing</span>
          <FaClock className="clock-icon" />
        </button>
      )}
    </div>
  );
}
