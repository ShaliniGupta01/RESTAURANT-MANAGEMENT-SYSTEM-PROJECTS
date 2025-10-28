
import React, { useEffect, useState } from "react";
import ChartCard from "../../components/ChartCard";
import axios from "axios";
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
      const res = await axios.get("http://localhost:5000/api/tables");
      let data = res.data || [];

      // ensure always 30 tables
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
        {tables.map((t, index) => (
          <div
            key={t._id || index}
            className={`mini-table ${t.reserved ? "reserved" : "available"}`}
          >
            <div>Table</div>
            <div>{String(t.tableNumber).padStart(2, "0")}</div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
