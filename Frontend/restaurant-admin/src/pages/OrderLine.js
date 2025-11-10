import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OrderCard from "../components/OrderCard";
import "./OrderLine.css";

export default function OrderLine({ onOrderUpdate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/api/orders");
      if (Array.isArray(res.data)) setOrders(res.data);
      else if (res.data?.orders) setOrders(res.data.orders);
      else setOrders([]);
    } catch (err) {
      setError("Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change from OrderCard
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.patch(`/api/orders/${id}`, { status: newStatus });
      if (res.status === 200 && res.data?.order) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === id || o.orderId === id ? res.data.order : o
          )
        );
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (err) {
      setError("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orderline-wrapper">
      <div className="orders-page-wrapper">
        <h2 className="orders-title">Order Line</h2>

        {loading && <p className="info-text">Loading orders...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="order-container">
            {orders.length === 0 ? (
              <p className="info-text">No orders found.</p>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order._id || order.orderId}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
