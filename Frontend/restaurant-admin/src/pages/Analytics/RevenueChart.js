import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
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
  return (
    <ChartCard title="Revenue" className="revenue-card">
      <div className="chart-header-controls">
        <div className="header-text-section">
          <p className="placeholder-text">Revenue performance overview</p>
          <hr className="revenue-divider" />
        </div>
        <TimeFilter selected={revenueFilter} setSelected={setRevenueFilter} />
      </div>

      {/* White chart background container */}
      <div className="revenue-chart-container">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide={true} domain={[0, 1000]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Light gray background bars */}
            <Bar
              dataKey="value"
              fill="#E5E7EB"
              barSize={20}
              radius={[4, 4, 0, 0]}
            />

            {/* Revenue Line */}
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
