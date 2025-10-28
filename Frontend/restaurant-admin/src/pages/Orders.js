
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OrderCard from "../components/OrderCard";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}`, { status });
      await fetchOrders(); // refresh order list after update
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order status");
    }
  };

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2 className="orders-title">Order Line</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="order-container">
          {orders.map((order) => (
            <OrderCard
              key={order._id || order.orderId}
              order={order}
              onUpdate={updateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
