import React, { useState, useEffect } from "react";
import { FaUtensils, FaClock, FaCheckCircle } from "react-icons/fa";
import "./OrderCard.css";
import API from "../api/axios";

export default function OrderCard({ order, onStatusChange, onOrderStatusChange }) {
  // Detect Takeaway or Dine In
  const isTakeaway =
    order?.type?.toLowerCase().includes("take") ||
    order?.orderType?.toLowerCase().includes("take");

  // --- Initial Status ---
  const [status, setStatus] = useState(order?.status || "Processing");

  // --- Sync UI with backend whenever order updates ---
  useEffect(() => {
    setStatus(order?.status || "Processing");
  }, [order?.status]);

  // --- Handle Serve Click (for Dine-In orders only) ---
  const handleProcessingClick = async () => {
    if (isTakeaway || status === "Served") return; // Takeaway auto-served already

    try {
      const newStatus = "Served";
      setStatus(newStatus);

      const res = await API.patch(`/api/orders/${order._id}`, {
        status: newStatus,
      });
      console.log("Order served successfully:", res.data);

      // Tell parent (Orders.jsx or AdminDashboard) to refresh analytics
      // if (onStatusChange) onStatusChange(order._id, newStatus);
      // change..........
      if (onStatusChange) onStatusChange(order._id, newStatus);

// 👇 ye line add karo yahi par
onOrderStatusChange?.();  // refresh analytics instantly

    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // --- Card color logic ---
  const getCardClass = () => {
    if (isTakeaway) return "takeaway-card";
    if (status?.toLowerCase() === "served") return "done-card";
    return "processing-card";
  };

  return (
    <div className={`order-card ${getCardClass()}`}>
      {/* === HEADER === */}
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
              ? "Completed"
              : status === "Served"
              ? "Served"
              : "Processing"}
          </p>
        </div>
      </div>

      {/* === ITEMS === */}
      <p className="item-count">
        {order?.items?.length || 0} Item{order?.items?.length > 1 ? "s" : ""}
      </p>

      <div className="order-body">
        <div className="order-item">
          {order?.items?.length > 0 ? (
            <ul>
              {order.items.map((it, i) => (
                <li key={i}>
                  {it.quantity} × {it.name || it}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items</p>
          )}
        </div>
      </div>

      {/* === FOOTER === */}
      {isTakeaway || status === "Served" ? (
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
