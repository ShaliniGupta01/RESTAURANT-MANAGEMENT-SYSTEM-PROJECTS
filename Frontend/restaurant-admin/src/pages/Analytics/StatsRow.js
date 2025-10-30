import React from "react";
import { FaUsers, FaChartLine, FaUtensils, FaRupeeSign } from "react-icons/fa";
import "./StatsRow.css";
import { useSearch } from "../../context/SearchContext"; // 🔹 import your Search Context

// Custom StatCard component
const StatCard = ({ title, value, icon: Icon, iconColor, bgColor, isBlurred }) => (
  <div className={`custom-stat-card ${isBlurred ? "blurred" : ""}`}>
    <div
      className="icon-container"
      style={{ backgroundColor: bgColor, color: iconColor }}
    >
      <Icon size={20} />
    </div>
    <div className="text-content">
      <span className="stat-value">{value}</span>
      <span className="stat-title">{title}</span>
    </div>
  </div>
);

export default function StatsRow({ stats = {} }) {
  const { searchTerm } = useSearch(); // 🔹 get search text
  const term = searchTerm?.toLowerCase().trim() || "";

  const { totalRevenue = 0, totalOrders = 0, totalClients = 0 } = stats;

  // 🔹 Helper to decide which card should blur
  const shouldBlur = (title) => {
    if (!term) return false; // show all if empty
    if (term === "total") return false; // all visible for "total"

    // specific matches
    if (term.includes("total chef")) return title !== "TOTAL CHEF";
    if (term.includes("total order")) return title !== "TOTAL ORDERS";
    if (term.includes("total client") || term.includes("total clients"))
      return title !== "TOTAL CLIENTS";
    if (term.includes("total revenue")) return title !== "TOTAL REVENUE";

    // if search not related to totals, hide all total cards
    if (term.includes("ordersummary") || term.includes("revenue chart") || term.includes("tables"))
      return true;

    return false;
  };

  return (
    <div className="stats-row">
      <StatCard
        title="TOTAL CHEF"
        value={String(4).padStart(2, "0")}
        icon={FaUtensils}
        iconColor="#60a5fa"
        bgColor="#eff6ff"
        isBlurred={shouldBlur("TOTAL CHEF")}
      />
      <StatCard
        title="TOTAL REVENUE"
        value={`₹${(totalRevenue / 1000).toFixed(1)}K`}
        icon={FaRupeeSign}
        iconColor="#34d399"
        bgColor="#d1fae5"
        isBlurred={shouldBlur("TOTAL REVENUE")}
      />
      <StatCard
        title="TOTAL ORDERS"
        value={String(totalOrders).padStart(2, "0")}
        icon={FaChartLine}
        iconColor="#fcd34d"
        bgColor="#fefce8"
        isBlurred={shouldBlur("TOTAL ORDERS")}
      />
      <StatCard
        title="TOTAL CLIENTS"
        value={String(totalClients).padStart(2, "0")}
        icon={FaUsers}
        iconColor="#fb923c"
        bgColor="#fff7ed"
        isBlurred={shouldBlur("TOTAL CLIENTS")}
      />
    </div>
  );
}
