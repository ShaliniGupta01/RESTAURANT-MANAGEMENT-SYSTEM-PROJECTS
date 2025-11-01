import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaChair, FaPlus } from "react-icons/fa";
import API from "../api/axios";
import "./Tables.css";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextTableNumber, setNextTableNumber] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  // === Fetch all tables ===
  const fetchTables = async () => {
    try {
      const res = await API.get("/api/tables");
      const data =
        Array.isArray(res.data) ? res.data : res.data.tables || res.data || [];
      setTables(data);

      // determine next table number
      const maxNum =
        data.length > 0 ? Math.max(...data.map((t) => t.tableNumber || 0)) : 0;
      setNextTableNumber(maxNum + 1);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setTables([]);
    }
  };

  // === Add single new table ===
  const addTable = async (payload) => {
    try {
      setLoading(true);
      const res = await API.post("/api/tables", payload);
      setTables((prev) => [...prev, res.data]);
      setShowModal(false);
      setNextTableNumber((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding table:", err);
      alert("Failed to add table. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // === Delete table ===
  const deleteTable = async (id) => {
    try {
      await API.delete(`/api/tables/${id}`);
      setTables((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting table:", err);
      alert("Failed to delete table.");
    }
  };

  // === First-time create 30 tables ===
  const createInitial30Tables = async () => {
    if (!window.confirm("Create 30 tables for the first time?")) return;
    setLoading(true);
    try {
      const bulkTables = Array.from({ length: 30 }, (_, i) => ({
        tableNumber: i + 1,
        size: 4, // default chairs per table
        tableName: `Table-${i + 1}`,
      }));

      await Promise.all(bulkTables.map((t) => API.post("/api/tables", t)));
      await fetchTables();
      alert("30 tables created successfully!");
    } catch (err) {
      console.error("Error creating 30 tables:", err);
      alert("Failed to create initial tables.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tables-page">
      <h2>Tables</h2>

      <div className="tables-grid">
        {tables.map((t) => (
          <div key={t._id} className="table-card">
            <button
              className="delete-icon"
              onClick={() => deleteTable(t._id)}
              title="Delete Table"
            >
              <FaTrashAlt />
            </button>

            <div className="table-name">{t.tableName || "Table"}</div>
            <div className="table-number">
              {String(t.tableNumber).padStart(2, "0")}
            </div>

            <div className="table-footer">
              <FaChair className="chair-icon" />
              <span className="chair-count">
                {t.size?.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* === Add Table Card === */}
        <div className="add-table-wrapper">
          <div
            className="add-table-card"
            onClick={async () => {
              if (tables.length === 0) {
                // First click → create 30 tables
                await createInitial30Tables();
              } else if (tables.length >= 30 && tables.length < 31) {
                // Then → open modal for table 31 only
                setShowModal((prev) => !prev);
              } else {
                alert("You can only create up to 31 tables (1–31).");
              }
            }}
            title="Add Table"
          >
            <FaPlus className="plus-icon" />
          </div>

          {showModal && (
            <div className="side-modal">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>

              <label className="label">Table name (optional)</label>
              <input
                placeholder="Enter table name..."
                className="input-field"
                id="tableName"
              />

              <div className="table-number-big">
                {String(nextTableNumber).padStart(2, "0")}
              </div>

              <hr className="divider" />

              <label className="label">Chairs</label>
              <select id="chairCount" className="select-field">
                <option value="2">02</option>
                <option value="4">04</option>
                <option value="6">06</option>
                <option value="8">08</option>
              </select>

              <button
                className="btn-create-full"
                disabled={loading}
                onClick={() => {
                  const name = document.getElementById("tableName").value;
                  const size = Number(
                    document.getElementById("chairCount").value
                  );

                  if (nextTableNumber > 31) {
                    alert("You can only create Table 31.");
                    return;
                  }

                  addTable({
                    size,
                    tableName: name,
                    tableNumber: nextTableNumber,
                  });
                }}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
