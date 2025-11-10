/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import CartSummary from "../../components/CartSummary/Cart";
import CookingInstruction from "../../components/CookingInstruction/CookingInstruction";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("rms_cart")) || []
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("rms_user")) || {}
  );
  const [orderType, setOrderType] = useState("Dine In");
  const [cookVisible, setCookVisible] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch tables
  useEffect(() => {
    api
      .get("/api/tables")
      .then((res) => {
        const t = Array.isArray(res.data) ? res.data : res.data.tables || [];
        setTables(t);
      })
      .catch(() => {
        // fallback local tables if API fails
        setTables(
          Array.from({ length: 30 }, (_, i) => ({
            tableNumber: i + 1,
            size: [2, 4, 6, 8][i % 4],
            reserved: false,
          }))
        );
      });
  }, []);

  // Save cart in localStorage
  useEffect(() => {
    localStorage.setItem("rms_cart", JSON.stringify(cart));
  }, [cart]);

  // Lock body scroll when modal visible
  useEffect(() => {
    document.body.style.overflow = cookVisible ? "hidden" : "auto";
  }, [cookVisible]);

  // Update item quantity
  const updateQty = (_id, name, delta) => {
    setCart((prev) => {
      const updated = prev
        .map((x) =>
          x._id === _id && x.name === name
            ? { ...x, qty: Math.max(0, x.qty + delta) }
            : x
        )
        .filter((x) => x.qty > 0);

      if (updated.length === 0) navigate("/");
      return updated;
    });
  };

  // Remove item from cart
  const removeItem = (_id, name) => {
    setCart((prev) => prev.filter((x) => !(x._id === _id && x.name === name)));
  };

  // Calculate totals
  const computeTotals = () => {
    const itemsTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);
    const delivery = orderType === "Take Away" ? 50 : 0;
    const taxes = Math.round(itemsTotal * 0.05);
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

      // mark reserved locally
      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === table.tableNumber ? { ...t, reserved: true } : t
        )
      );

      // no backend PATCH to avoid 404 error
      console.log(
        `Table #${table.tableNumber} reserved locally (backend call skipped).`
      );
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
        image: item.image || "",
      })),
      totalAmount: totals.grandTotal,
      clientName: user?.name || "Guest",
      phoneNumber: user?.phone || "N/A",
      address:
        orderType === "Take Away" ? user?.address || "N/A" : "Restaurant",
      instructions,
      totals,
      user,
    };

    try {
      const res = await api.post("/api/orders", orderData);
      if (res.status === 201 || res.status === 200) {
        alert("Order placed successfully!");
        localStorage.removeItem("rms_cart");
        setCart([]);
        navigate("/thankyou");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Could not place order. Try again.");
    }
  };

  // Greeting
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
  })();

  return (
    <div className="checkout-shell">
      <div className={`checkout-content ${cookVisible ? "blurred" : ""}`}>
        {/* Header */}
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
            <div className="cart-item" key={it._id}>
              <div className="cart-item-inner">
                <div className="cart-img">
                  <img
                    src={
                      it.image
                        ? it.image.startsWith("http")
                          ? it.image
                          : `https://restaurant-backend-1rky.onrender.com/${it.image}`
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
                  <button onClick={() => updateQty(it._id, it.name, -1)}>
                    -
                  </button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it._id, it.name, +1)}>
                    +
                  </button>
                </div>

                {/* Delete button */}
                <button
                  className="ci-delete"
                  onClick={() => removeItem(it._id, it.name)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add cooking instructions */}
        <div style={{ marginTop: 10 }}>
          <button
            className="add-instruction"
            onClick={() => setCookVisible(true)}
          >
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

        {/* Order summary */}
        <CartSummary
          cart={cart}
          user={user}
          orderType={orderType}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>

      {/* Cooking instruction modal */}
      <CookingInstruction
        visible={cookVisible}
        onClose={() => setCookVisible(false)}
        onSave={setInstructions}
      />
    </div>
  );
}
