import React, { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import AddProduct from "../components/AddProduct";
import ProductCard from "../components/ProductCard";
import "./AdminMenu.css";
import { useSearch } from "../context/SearchContext";

export default function AdminMenu() {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Fetch all products ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/menu");
      const productList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.menu)
        ? res.data.menu
        : [];

      setProducts(productList);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const handleProductAdded = () => {
    setShowModal(false);
    fetchProducts();
  };

  //  Filter products by category OR name (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="menu-container">
      <div className={`menu-page ${showModal ? "blur-bg" : ""}`}>
        <div className="menu-header">
          <h2>Product Menu</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add Product
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="empty">No products found</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id || item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddProduct
          onClose={() => setShowModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
}
