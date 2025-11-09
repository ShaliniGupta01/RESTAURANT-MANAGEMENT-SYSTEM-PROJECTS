import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OrderCard from "../components/OrderCard";
import "./OrderLine.css";

export default function OrderLine({ onOrderUpdate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  Fetch all orders (including Served)
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
        console.warn(" Unexpected response format:", res.data);
        setOrders([]);
      }
    } catch (err) {
      console.error(" Failed to fetch orders:", err);
      setError("Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  //  Update only the "status" field of an order
  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log("Updating order:", id, "→", newStatus);
      const res = await API.patch(`/api/orders/${id}`, { status: newStatus });

      if (res.status === 200 && res.data?.order) {
        //  Update local state without refetching all orders
        setOrders((prev) =>
          prev.map((o) =>
            o._id === id || o.orderId === id ? res.data.order : o
          )
        );

        //  Notify parent (AdminDashboard) to refresh analytics
        if (onOrderUpdate) onOrderUpdate();
      } else {
        console.warn(" Unexpected response:", res.data);
      }
    } catch (err) {
      console.error(" Error updating order:", err.response?.data || err.message);
      setError("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-text">{error}</p>;

  //  Display all orders (Dine-in + Takeaway + Served)
  return (
    <div className="orders-page">
      <h2 className="orders-title">Order Line</h2>

      <div className="order-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
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
    </div>
  );
}
