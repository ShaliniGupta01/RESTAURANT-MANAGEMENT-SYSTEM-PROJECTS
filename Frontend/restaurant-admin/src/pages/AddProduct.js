import React, { useState } from "react";
import API from "../api/axios";
import "./AddProduct.css";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    averagePreparationTime: "",
    inStock: "",
    rating: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  //  Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //  Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle form submission
  const submit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.price || !form.category) {
      alert(" Please fill all required fields!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("averagePreparationTime", form.averagePreparationTime);
      formData.append("stock", form.inStock === "Yes" ? "9999" : "0");
      formData.append("rating", form.rating);
      if (image) formData.append("image", image);

      //  Correct backend endpoint: /api/menu
      await API.post("/api/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");

      //  Reset form
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        averagePreparationTime: "",
        inStock: "",
        rating: "",
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Error adding product:", err);
      alert(err.response?.data?.message || " Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="form-container">
        <h2>Add Product</h2>

        <form className="add-product-form" onSubmit={submit}>
          {/* Image Upload */}
          <div className="image-upload">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-img" />
            ) : (
              <div className="upload-box">Upload Image</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>

          {/* Form Inputs */}
          <input
            required
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            required
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <select
            required
            name="category"
            value={form.category}
            onChange={handleChange}
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
            name="averagePreparationTime"
            placeholder="Average Prep Time (e.g. 20 mins)"
            value={form.averagePreparationTime}
            onChange={handleChange}
          />

          <select
            required
            name="inStock"
            value={form.inStock}
            onChange={handleChange}
          >
            <option value="">In Stock?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <input
            type="number"
            name="rating"
            placeholder="Rating (1–5)"
            value={form.rating}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

