import React, { useState } from "react";
import "./CookingInstruction.css";

export default function CookInstructionsModal({ visible, onClose, onSave }) {
  const [text, setText] = useState("");

  if (!visible) return null;

  return (
    <div className="cook-overlay">
      <div className="cook-card top">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h3>Add Cooking instructions</h3>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Optional instructions"
        />

        <p className="cook-note">
          The restaurant will try its best to follow your request. However,
          refunds or cancellations in this regard won’t be possible
        </p>

        <div className="cook-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-next"
            onClick={() => {
              onSave(text);
              onClose();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
