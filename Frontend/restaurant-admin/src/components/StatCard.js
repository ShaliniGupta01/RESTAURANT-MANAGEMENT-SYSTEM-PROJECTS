import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
  <div className="custom-stat-card">
    <div className="icon-container" style={{ backgroundColor: bgColor, color: iconColor }}>
      <Icon size={20} />
    </div>
    <div className="text-content">
      <span className="stat-value">{value}</span>
      <span className="stat-title">{title}</span>
    </div>
  </div>
);

export default StatCard;
