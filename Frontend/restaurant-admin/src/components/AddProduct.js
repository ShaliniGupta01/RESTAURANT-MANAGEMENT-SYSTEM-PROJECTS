import React, { useState } from "react";
import API from "../api/axios";
import "./AddProduct.css";

export default function AddProduct({ onClose, onProductAdded }) {
  const [forms, setForms] = useState([
    {
      id: Date.now(),
      name: "",
      description: "",
      category: "",
      price: "",
      averagePreparationTime: "",
      inStock: "",
      rating: "",
      imageFile: null,
      preview: null,
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (id, field, value) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleImageChange = (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, imageFile: file, preview } : f))
    );
  };

  const removeProduct = (id) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
    showToast("success", "Product form removed!");
  };

  const validate = (form) => {
    if (!form.name.trim()) return "Name is required";
    if (!form.category) return "Category is required";
    if (!form.price || Number(form.price) <= 0)
      return "Price must be greater than 0";
    if (!form.averagePreparationTime.trim())
      return "Preparation time is required";
    if (!form.inStock) return "Please select stock status";
    return null;
  };

  const submitAll = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      for (const form of forms) {
        const errorMsg = validate(form);
        if (errorMsg) {
          showToast("error", errorMsg);
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("category", form.category);
        formData.append("price", form.price);
        formData.append("averagePreparationTime", form.averagePreparationTime);
        formData.append("stock", form.inStock === "Yes" ? "9999" : "0");
        formData.append("rating", form.rating || 0);
        if (form.imageFile) formData.append("image", form.imageFile);

        const res = await API.post("/api/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (onProductAdded) onProductAdded(res.data);
      }

      showToast("success", "All products added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Failed to add products";
      showToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  const addAnotherProduct = () => {
    setForms((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        description: "",
        category: "",
        price: "",
        averagePreparationTime: "",
        inStock: "",
        rating: "",
        imageFile: null,
        preview: null,
      },
    ]);
    showToast("success", "New product form added below!");
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-wrapper">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Add Products</h3>

          <form className="add-product-form" onSubmit={submitAll}>
            {forms.map((form) => (
              <div key={form.id} className="product-form-block">
                {/* Removed Product # title, only Remove button kept */}
                {forms.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeProduct(form.id)}
                  >
                    Remove
                  </button>
                )}

                <div className="form-fields">
                  <div className="image-upload">
                    {form.preview ? (
                      <img src={form.preview} alt="Preview" className="preview-img" />
                    ) : (
                      <div className="upload-box">Upload Image</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(form.id, e)}
                      className="file-input"
                    />
                  </div>

                  <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                      handleChange(form.id, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      handleChange(form.id, "price", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      handleChange(form.id, "description", e.target.value)
                    }
                  />
                  <select
                    value={form.category}
                    onChange={(e) =>
                      handleChange(form.id, "category", e.target.value)
                    }
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
                    placeholder="Average Prep Time (e.g. 20 min)"
                    value={form.averagePreparationTime}
                    onChange={(e) =>
                      handleChange(form.id, "averagePreparationTime", e.target.value)
                    }
                  />
                  <select
                    value={form.inStock}
                    onChange={(e) =>
                      handleChange(form.id, "inStock", e.target.value)
                    }
                  >
                    <option value="">In Stock?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Rating (1-5)"
                    value={form.rating}
                    onChange={(e) =>
                      handleChange(form.id, "rating", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-add-another"
                onClick={addAnotherProduct}
              >
                + Add Another Product
              </button>

              <div className="right-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Products"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div
          className={`toast ${
            toast.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}
