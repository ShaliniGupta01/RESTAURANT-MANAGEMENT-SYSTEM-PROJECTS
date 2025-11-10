/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import FoodCard from "../../components/FoodCard/FoodCard";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import UserDetails from "../../components/Details/UserDetails";
import Categorymenu from "../../components/Category/Categorymenu";

// Static constants
const CATEGORIES = ["Burger", "Pizza", "Drink", "French fries", "Veggies"];
const BASE_URL = "https://restaurant-backend-1rky.onrender.com";

export default function Home() {
  const navigate = useNavigate();

  // --- State management ---
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("rms_user")) || null
  );
  const [showDetails, setShowDetails] = useState(!user);
  const [categories] = useState(CATEGORIES);
  const [selected, setSelected] = useState("Pizza");
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("rms_cart")) || []
  );

  const perPage = 8;
  const listRef = useRef();

  // --- Match category names loosely ---
  const matchCategory = (catFromDB, selectedCat) => {
    if (!catFromDB || !selectedCat) return false;
    const c1 = catFromDB.toLowerCase().replace(/\s+/g, "");
    const c2 = selectedCat.toLowerCase().replace(/\s+/g, "");
    return (
      c1 === c2 ||
      c1 === c2 + "s" ||
      c1 + "s" === c2 ||
      c1.includes(c2) ||
      c2.includes(c1)
    );
  };

  // --- Fetch menu items from backend ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/menu`);
        const data = await res.json();

        if (data.success) {
          const menuItems = (data.menu || data.data || []).map((item) => ({
            ...item,
            image: item.image
              ? item.image.startsWith("http")
                ? item.image
                : `${BASE_URL}${item.image.startsWith("/") ? item.image : "/" + item.image}`
              : "/default-food.png",
          }));

          setItems(menuItems);
          setVisibleItems(
            menuItems
              .filter((i) => matchCategory(i.category, selected))
              .slice(0, perPage)
          );
        } else {
          console.error(" No menu data found from backend");
          setItems([]);
          setVisibleItems([]);
        }
      } catch (err) {
        console.error(" Error fetching menu:", err);
        setItems([]);
        setVisibleItems([]);
      }
    };

    fetchMenu();
  }, [selected]);

  
  useEffect(() => {
    if (!search) return;
    const foundCategory = CATEGORIES.find(
      (cat) =>
        cat.toLowerCase().replace(/\s+/g, "") ===
          search.toLowerCase().replace(/\s+/g, "") ||
        cat.toLowerCase().includes(search.toLowerCase())
    );
    if (foundCategory && foundCategory !== selected) {
      setSelected(foundCategory);
    }
  }, [search]);

  // --- Filter by category + search ---
  useEffect(() => {
    const filtered = items.filter(
      (i) =>
        matchCategory(i.category, selected) &&
        i.name.toLowerCase().includes(search.toLowerCase())
    );
    setVisibleItems(filtered.slice(0, perPage));
  }, [selected, items, search]);

  // --- Save cart to localStorage ---
  useEffect(() => {
    localStorage.setItem("rms_cart", JSON.stringify(cart));
  }, [cart]);

  // --- Add or remove items from cart ---
  const onAdd = (item, delta) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) => p._id === item._id && p.name === item.name
      );
      if (exists) {
        const updated = prev
          .map((p) =>
            p._id === item._id && p.name === item.name
              ? { ...p, qty: Math.max(0, p.qty + delta) }
              : p
          )
          .filter((p) => p.qty > 0);
        return updated;
      } else if (delta > 0) {
        return [
          ...prev,
          {
            _id: item._id,
            name: item.name,
            price: item.price,
            qty: delta,
            image: item.image,
          },
        ];
      }
      return prev;
    });
  };

  const qtyOf = (id, name) =>
    cart.find((c) => c._id === id && c.name === name)?.qty || 0;

 
  const loadMore = () => {
    const filtered = items.filter(
      (i) =>
        matchCategory(i.category, selected) &&
        i.name.toLowerCase().includes(search.toLowerCase())
    );
    const next = filtered.slice(
      visibleItems.length,
      visibleItems.length + perPage
    );
    if (next.length) setVisibleItems((v) => [...v, ...next]);
  };

  const onScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) loadMore();
  };

  // --- Handle user detail modal ---
  const handleDetailsSave = (u) => {
    setUser(u);
    setShowDetails(false);
  };

  // --- Render ---
  return (
    <>
      <div className={`home-page ${showDetails ? "modal-active" : ""}`}>
        {/* Header */}
        <header className="home-header">
          <div className="group">
            <div className="group-large">
              Good{" "}
              {(() => {
                const h = new Date().getHours();
                if (h < 12) return "morning";
                if (h < 17) return "afternoon";
                return "evening";
              })()}
            </div>
            <div className="group-small">Place your order here</div>
          </div>
        </header>

       
        <div className="search-row">
          <SearchBar value={search} onChange={setSearch} />
          {cart.length > 0 && (
            <div className="cart-total">
              ₹{cart.reduce((s, c) => s + c.qty * c.price, 0)}
            </div>
          )}
        </div>

        
        {(!search ||
          !CATEGORIES.some((cat) =>
            cat.toLowerCase().includes(search.toLowerCase())
          )) && (
          <Categorymenu
            categories={categories}
            selected={selected}
            onSelect={setSelected}
          />
        )}

        <div className="category-title">{selected}</div>

        {/* Items grid */}
        <div className="items-grid" onScroll={onScroll} ref={listRef}>
          {visibleItems.length > 0 ? (
            visibleItems.map((it) => (
              <FoodCard
                key={`${it._id}-${it.name}`}
                item={it}
                qty={qtyOf(it._id, it.name)}
                onChangeQty={onAdd}
              />
            ))
          ) : (
            <div className="no-results">No items found.</div>
          )}
        </div>

        {/* Checkout button */}
        <div className="next-fixed">
          <button className="btn-next" onClick={() => navigate("/checkout")}>
            Next
          </button>
        </div>
      </div>

      {/* User details modal */}
      {showDetails && (
        <UserDetails visible={showDetails} onSave={handleDetailsSave} />
      )}
    </>
  );
}
