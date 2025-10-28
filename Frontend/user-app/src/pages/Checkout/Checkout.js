

import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import CartSummary from "../../components/CartSummary/Cart";
import CookingInstruction from "../../components/CookingInstruction/CookingInstruction";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("rms_cart")) || []);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("rms_user")) || {});
  const [orderType, setOrderType] = useState("Dine In");
  const [cookVisible, setCookVisible] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch tables
  useEffect(() => {
    api
      .get("/tables")
      .then((res) => {
        const t = Array.isArray(res.data) ? res.data : res.data.tables || [];
        setTables(t);
      })
      .catch(() => {
        // fallback mock tables
        setTables(
          Array.from({ length: 30 }, (_, i) => ({
            tableNumber: i + 1,
            size: [2, 4, 6, 8][i % 4],
            reserved: false,
          }))
        );
      });
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("rms_cart", JSON.stringify(cart));
  }, [cart]);

  // Update quantity
  const updateQty = (id, delta) => {
    setCart((prev) => {
      const p = prev.find((x) => x.id === id);
      if (!p && delta > 0)
        return [...prev, { id, name: "Item", price: 0, qty: delta }];

      const updated = prev
        .map((x) =>
          x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x
        )
        .filter((x) => x.qty > 0);

      if (updated.length === 0) navigate("/");

      return updated;
    });
  };

  // Calculate totals
  const computeTotals = () => {
    const itemsTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
    const delivery = orderType === "Take Away" ? 50 : 0;
    const taxes = 5;
    return {
      itemsTotal,
      delivery,
      taxes,
      grandTotal: itemsTotal + delivery + taxes,
    };
  };

  // Find available table
  const findTable = () => {
    const members = user?.members || 1;
    const sizes = [2, 4, 6, 8];
    for (const sz of sizes) {
      if (sz < members) continue;
      const found = tables.find((t) => t.size === sz && !t.reserved);
      if (found) return found;
    }
    return null;
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let tableNumber = null;
    if (orderType === "Dine In") {
      const table = findTable();
      if (!table) {
        alert("All tables are full. Please wait.");
        return;
      }
      tableNumber = table.tableNumber;
      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === table.tableNumber ? { ...t, reserved: true } : t
        )
      );
      try {
        await api.patch(`/tables/${table.tableNumber}`, { reserved: true });
      } catch {
        console.warn("Table reservation failed, proceeding locally.");
      }
    }

    const totals = computeTotals();
    const orderData = {
      orderId: `ODR-${Date.now()}`,
      type: orderType === "Take Away" ? "Takeaway" : "Dine In",
      tableNumber,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.qty,
        price: item.price,
        image: item.image || "", //  Include image if exists
      })),
      totalAmount: totals.grandTotal,
      clientName: user?.name || "Guest",
      phoneNumber: user?.phone || "N/A",
      address: orderType === "Take Away" ? user?.address || "N/A" : "Restaurant",
      instructions,
      totals,
      user,
    };

    try {
      const res = await api.post("/orders", orderData);
      if (res.status === 201 || res.status === 200) {
        alert("Order placed successfully!");
        localStorage.removeItem("rms_cart");
        setCart([]);
        navigate("/thankyou");
      }
    } catch (err) {
      console.error(" Order creation failed:", err);
      alert(" Could not place order. Try again.");
    }
  };

  // Dynamic greeting
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
  })();

  return (
    <div className="checkout-shell">
      {/* Header greeting */}
      <header className="home-header">
        <div className="greet">
          <div className="greet-large">Good {greeting}</div>
          <div className="greet-small">Place your order here</div>
        </div>
      </header>

      {/* Search bar */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Cart items */}
      <div className="cart-items">
        {cart.map((it) => (
          <div className="cart-item" key={it.id}>
            <div className="cart-img">
              <img
                src={
                  it.image
                    ? it.image.startsWith("http")
                      ? it.image
                      : `http://localhost:5000/${it.image}`
                    : "/placeholder.png"
                }
                alt={it.name}
              />
            </div>
            <div className="cart-info">
              <div className="ci-name">{it.name}</div>
              <div className="ci-price">₹{it.price}</div>
            </div>
            <div className="ci-controls">
              <button onClick={() => updateQty(it.id, -1)}>-</button>
              <span>{it.qty}</span>
              <button onClick={() => updateQty(it.id, +1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add cooking instructions */}
      <div style={{ marginTop: 10 }}>
        <button className="add-instruction" onClick={() => setCookVisible(true)}>
          Add cooking instructions (optional)
        </button>
      </div>

      {instructions && (
        <div className="cook-summary">
          <strong>Cooking Instructions:</strong> {instructions}
        </div>
      )}

      {/* Dine In / Take Away toggle */}
      <div className={`order-type ${orderType === "Take Away" ? "swap" : ""}`}>
        <button
          className={orderType === "Dine In" ? "active" : ""}
          onClick={() => setOrderType("Dine In")}
        >
          Dine In
        </button>
        <button
          className={orderType === "Take Away" ? "active" : ""}
          onClick={() => setOrderType("Take Away")}
        >
          Take Away
        </button>
      </div>

      {/* Swipe-to-order summary */}
      <CartSummary
        cart={cart}
        user={user}
        orderType={orderType}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Cooking instruction modal */}
      <CookingInstruction
        visible={cookVisible}
        onClose={() => setCookVisible(false)}
        onSave={setInstructions}
      />
    </div>
  );
}

