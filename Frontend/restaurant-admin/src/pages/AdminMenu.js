import React, { useEffect, useState } from "react";
import API from "../api/axios";
import AddProduct from "../components/AddProduct";
import ProductCard from "../components/ProductCard";
import "./AdminMenu.css";

export default function AdminMenu() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/menu");
      setProducts(Array.isArray(res.data) ? res.data : res.data?.menu || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Disable scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const handleProductAdded = () => {
    setShowModal(false);
    fetchProducts();
  };

  return (
    <div className="menu-container">
      {/* Main Product Area */}
      <div className={`menu-page ${showModal ? "blur-bg" : ""}`}>
        <div className="menu-header">
          <h2>Product Menu</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add Product
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : products.length === 0 ? (
          <p className="empty">No products available</p>
        ) : (
          <div className="product-grid">
            {products.map((item) => (
              <ProductCard key={item._id || item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Only Add Product Modal */}
      {showModal && (
        <AddProduct
          onClose={() => setShowModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
}
