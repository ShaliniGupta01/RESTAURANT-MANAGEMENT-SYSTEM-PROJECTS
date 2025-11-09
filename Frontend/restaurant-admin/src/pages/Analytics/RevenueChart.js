import React from "react";
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaAngleDown } from "react-icons/fa6";
import ChartCard from "../../components/ChartCard";
import "./RevenueChart.css";

const TimeFilter = ({ selected, setSelected }) => (
  <div className="time-filter">
    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
      <option value="Daily">Daily</option>
      <option value="Weekly">Weekly</option>
      <option value="Monthly">Monthly</option>
      <option value="Yearly">Yearly</option>
    </select>
    <FaAngleDown className="dropdown-icon" />
  </div>
);

export default function RevenueChart({ lineData, revenueFilter, setRevenueFilter }) {
  //  Dynamically format the day labels (Sun, Mon, Tue...)
  const formatDayLabel = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., Mon, Tue
  };

  //  Transform your data to include day names
  const formattedData = lineData.map((item) => ({
    ...item,
    name: formatDayLabel(item.date || item.name), 
  }));

  return (
    <ChartCard className="revenue-card">
    <p className="heading">Revenue</p>
      <div className="chart-header-controls">
        <div className="header-text-section">
          <p className="placeholder-text">Revenue performance overview</p>
          <hr className="revenue-divider" />
        </div>
        <TimeFilter selected={revenueFilter} setSelected={setRevenueFilter} />
      </div>
    <div className="revenue-chart-container">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={formattedData}>
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#6b7280", fontSize: 12 }}
        padding={{ left: 10, right: 10 }}
      />
      <YAxis hide={true} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
        }}
      />
      <Bar dataKey="value" fill="#E5E7EB" barSize={30} radius={[6, 6, 0, 0]} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#1f2937"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
    </ChartCard>
  );
}
