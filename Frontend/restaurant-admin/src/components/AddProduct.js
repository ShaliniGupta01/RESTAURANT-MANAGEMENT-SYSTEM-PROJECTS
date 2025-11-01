import React, { useState } from "react";
import API from "../api/axios";
import "./AddProduct.css";

export default function AddProduct({ onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    averagePreparationTime: "",
    inStock: "",
    rating: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text }

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.category) return "Category is required";
    if (!form.price || Number(form.price) <= 0) return "Price must be > 0";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      showToast("error", err);
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("averagePreparationTime", form.averagePreparationTime);
      formData.append("stock", form.inStock === "Yes" ? "9999" : "0");
      formData.append("rating", form.rating || 0);
      if (imageFile) formData.append("image", imageFile);

      const res = await API.post("/api/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("success", "Product added successfully");
      // reset form
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        averagePreparationTime: "",
        inStock: "",
        rating: "",
      });
      setImageFile(null);
      setPreview(null);

      // notify parent to refresh list & close modal
      if (onProductAdded) onProductAdded(res.data);
    } catch (err) {
      console.error("Add product error:", err);
      const message = err?.response?.data?.message || "Failed to add product";
      showToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-wrapper">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <h3>Add Product</h3>
          <form className="add-product-form" onSubmit={submit}>
            <div className="image-upload">
              {preview ? (
                <img src={preview} alt="Preview" className="preview-img" />
              ) : (
                <div className="upload-box">Upload Image</div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
            </div>

            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Burger">Burger</option>
              <option value="Pizza">Pizza</option>
              <option value="Fries">Fries</option>
              <option value="Drinks">Drinks</option>
              <option value="Veggies">Veggies</option>
            </select>

            <input
              type="text"
              placeholder="Average Prep Time (e.g. 20 mins)"
              value={form.averagePreparationTime}
              onChange={(e) => setForm({ ...form, averagePreparationTime: e.target.value })}
            />

            <select
              required
              value={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.value })}
            >
              <option value="">In Stock?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <input
              type="number"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn-create" disabled={submitting}>
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.text}
        </div>
      )}
    </>
  );
}
