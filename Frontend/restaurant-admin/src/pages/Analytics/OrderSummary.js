import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaAngleDown } from "react-icons/fa6";
import ChartCard from "../../components/ChartCard";
import "./OrderSummary.css";

const TimeFilter = ({ selected, setSelected }) => (
  <div className="time-filter">
    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
      <option value="Daily">Daily</option>
      <option value="Weekly">Weekly</option>
      <option value="Monthly">Monthly</option>
    </select>
    <FaAngleDown className="dropdown-icon" />
  </div>
);

const OrderMetric = ({ name, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="order-metric">
      <div className="metric-header">
        <span className="metric-name" style={{ color }}>
          {name} ({percent}%)
        </span>
        <span className="metric-value">{value}</span>
      </div>
      <div className="metric-bar-container">
        <div
          className="metric-bar"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default function OrderSummary({ served, dineIn, takeAway, filter, setFilter }) {
  const totalOrders = served + dineIn + takeAway;

  const pieData = useMemo(
    () => [
      { name: "Dine In", value: dineIn, color: "#2C2C2C" },
      { name: "Take Away", value: takeAway, color: "#5B5B5B" },
      { name: "Served", value: served, color: "#828282" },
    ],
    [served, dineIn, takeAway]
  );

  return (
    <ChartCard title="Order Summary" className="order-summary-card">
      <div className="chart-header-controls">
        <p className="placeholder-text">Orders distribution overview</p>
        <TimeFilter selected={filter} setSelected={setFilter} />
      </div>

      {/*  Light grey divider under header */}
      <hr className="chart-divider" />

      <div className="order-summary-content">
        {/* === Order Count Boxes === */}
        <div className="order-count-cards">
          <div className="order-count-card white-bg">
            <span className="count-value">{String(served).padStart(2, "0")}</span>
            <span className="count-label">Served</span>
          </div>
          <div className="order-count-card white-bg">
            <span className="count-value">{String(dineIn).padStart(2, "0")}</span>
            <span className="count-label">Dine In</span>
          </div>
          <div className="order-count-card white-bg">
            <span className="count-value">{String(takeAway).padStart(2, "0")}</span>
            <span className="count-label">Take Away</span>
          </div>
        </div>

        <div className="order-pie-and-metrics">
          {/* === Pie Chart === */}
          <ResponsiveContainer width="30%" height={100}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={45}
                innerRadius={35}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* === Metrics Progress Bars === */}
          <div className="metrics-list">
            <OrderMetric
              name="Take Away"
              value={takeAway}
              total={totalOrders}
              color="#5B5B5B"
            />
            <OrderMetric
              name="Served"
              value={served}
              total={totalOrders}
              color="#828282"
            />
            <OrderMetric
              name="Dine In"
              value={dineIn}
              total={totalOrders}
              color="#2C2C2C"
            />
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
