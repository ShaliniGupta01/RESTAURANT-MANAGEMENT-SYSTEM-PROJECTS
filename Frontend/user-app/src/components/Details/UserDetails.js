import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./UserDetails.css";

export default function Details({ visible, onSave }) {
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

        // try to post to backend /users (optional)
        setSaving(true);
        try {
            await api.post("/users", user);
        } catch (err) {
            // ignore errors (still save locally)
        } finally {
            setSaving(false);
            localStorage.setItem("rms_user", JSON.stringify(user));
            onSave(user);
        }
    };

    return (
        <div className="dm-overlay">
            <div className="dm-card">
                <h3>Enter Your Details</h3>
                <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                <input type="number" min="1" max="8" placeholder="Number of Person (max 8)" value={members} onChange={e => setMembers(Math.max(1, Math.min(8, Number(e.target.value))))} />
                <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                <input placeholder="Contact (mobile number)" value={phone} onChange={e => setPhone(e.target.value)} />
                <div className="dm-actions">
                    <button onClick={handleSave} className="btn-save" disabled={saving}>{saving ? "Saving..." : "Order Now"}</button>
                </div>
            </div>
        </div>
    );
}
