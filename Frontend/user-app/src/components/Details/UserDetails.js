

import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./UserDetails.css";

export default function UserDetails({ visible, onSave }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState(2);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (val === "") {
      setMembers("");
      return;
    }
    const num = Number(val);
    if (num >= 1 && num <= 8) {
      setMembers(num);
    }
  };

  const handleSave = async () => {
    if (!name || !phone) {
      alert("Please provide name and contact");
      return;
    }
    if (members < 1 || members > 8) {
      alert("Members must be between 1 and 8");
      return;
    }

    const user = { name, members, address, phone };

    setSaving(true);
    try {
      await api.post("/users", user);
    } catch (err) {
      // ignore backend save errors
    } finally {
      setSaving(false);
      localStorage.setItem("rms_user", JSON.stringify(user));
      onSave(user);
    }
  };

  return (
    <div className="user-overlay">
      <div className="user-card">
        <h3>Enter Your Details</h3>

        <div className="form">
          <label>Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form">
          <label>Number of Person</label>
          <input
            type="number"
            min="1"
            max="8"
            placeholder="1–8"
            value={members}
            onChange={handleMembersChange}
          />
        </div>

        <div className="form">
          <label>Address</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form">
          <label>Contact</label>
          <input
            type="text"
            placeholder="Mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="btn-actions">
          <button onClick={handleSave} className="btn-save" disabled={saving}>
            {saving ? "Saving..." : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
