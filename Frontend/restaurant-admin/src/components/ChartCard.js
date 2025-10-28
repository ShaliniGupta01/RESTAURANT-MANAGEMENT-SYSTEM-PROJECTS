import React from "react";
import "./ChartCard.css";

export default function ChartCard({ title, children }) {
    return (
        <div className="chart-card">
            <div className="chart-title">{title}</div>
            <div className="chart-body">{children}</div>
        </div>
    );
}
