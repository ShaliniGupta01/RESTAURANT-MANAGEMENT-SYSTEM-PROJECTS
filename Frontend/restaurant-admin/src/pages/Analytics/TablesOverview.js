import React, { useEffect, useState } from "react";
import ChartCard from "../../components/ChartCard";
import axios from "../../api/axios";
import "./TablesOverview.css";

export default function TablesOverview() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get(
        "https://restaurant-backend-1rky.onrender.com/api/tables"
      ); //  Correct route
      let data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.tables)
        ? res.data.tables
        : [];

      // Ensure always 30 placeholders
      if (data.length < 30) {
        const extra = Array.from({ length: 30 - data.length }, (_, i) => ({
          tableNumber: data.length + i + 1,
          reserved: false,
        }));
        data = [...data, ...extra];
      }

      setTables(data);
    } catch (err) {
      console.error("Error fetching tables:", err);
      // fallback sample for frontend testing
      const sample = Array.from({ length: 30 }, (_, i) => ({
        tableNumber: i + 1,
        reserved: i % 4 === 0,
      }));
      setTables(sample);
    }
  };

  return (
    <ChartCard className="tables-overview-card">
      <div className="tables-header">
        <h3 className="tables-title">Tables</h3>
        <div className="tables-legend">
          <div className="legend-item">
            <div className="legend-color reserved-color"></div> Reserved
          </div>
          <div className="legend-item">
            <div className="legend-color available-color"></div> Available
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="table-grid-preview">
        {Array.isArray(tables) && tables.length > 0 ? (
          tables.map((t, index) => (
            <div
              key={t._id || index}
              className={`mini-table ${t.reserved ? "reserved" : "available"}`}
            >
              <div>Table</div>
              <div>{String(t.tableNumber).padStart(2, "0")}</div>
            </div>
          ))
        ) : (
          <p className="no-tables">No tables found</p>
        )}
      </div>
    </ChartCard>
  );
}


