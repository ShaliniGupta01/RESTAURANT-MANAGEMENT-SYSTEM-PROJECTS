import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./UserDetails.css";

export default function UserDetails({ visible, onSave, totalAmount = 0 }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState(2);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ Load saved details
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("rms_user"));
    if (local) {
      setName(local.name || "");
      setMembers(local.members || 2);
      setAddress(local.address || "");
      setPhone(local.phone || "");
    }
  }, []);

  if (!visible) return null;

  const handleMembersChange = (e) => {
    const val = e.target.value;
    if (val === "") return setMembers("");
    const num = Number(val);
    if (num >= 1 && num <= 8) setMembers(num);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("⚠️ Please provide your name and contact number.");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone.trim())) {
      alert("📞 Please enter a valid 10-digit phone number.");
      return;
    }
    if (members < 1 || members > 8) {
      alert("👥 Members must be between 1 and 8.");
      return;
    }

    const user = { name, members, address, phone };

    setSaving(true);
    try {
      // Optional API save — ignore if server offline
      await api.post("/users", user).catch(() => {});
      localStorage.setItem("rms_user", JSON.stringify(user));
      onSave?.(user);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dm-overlay">
      <div className="dm-card">
        <h3>Enter Your Details</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Number of Persons</label>
          <input
            type="number"
            min="1"
            max="8"
            placeholder="1–8"
            value={members}
            onChange={handleMembersChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            maxLength="10"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="dm-actions">
          {/* ✅ Show total only if passed from Cart */}
          {totalAmount > 0 && (
            <div className="total-display">
              <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
            </div>
          )}

          <button
            onClick={handleSave}
            className="btn-save"
            disabled={saving}
          >
            {saving ? "Saving..." : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
