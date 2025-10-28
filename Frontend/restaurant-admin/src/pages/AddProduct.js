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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
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

      await API.post("/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // alert(" Product Added Successfully!");
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
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="add-product-page">
      <div className="form-container">
        <h2>Add Product</h2>

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

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}


