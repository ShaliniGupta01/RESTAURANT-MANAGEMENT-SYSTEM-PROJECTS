import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OrderCard from "../components/OrderCard";
import "./Orders.css";

export default function Orders({ onOrderUpdate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders (including served ones)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/api/orders");

      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data?.orders) {
        setOrders(res.data.orders);
      } else {
        console.warn("Unexpected response format:", res.data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.patch(`/api/orders/${id}`, { status: newStatus });
      if (res.status === 200 && res.data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? res.data.order : o))
        );
        if (onOrderUpdate) onOrderUpdate(); // Notify parent to update OrderSummary
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // Show *all* orders, including "Served"
  return (
    <div className="orders-page">
      <h2 className="orders-title">Order Line</h2>
      <div className="order-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id || order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
