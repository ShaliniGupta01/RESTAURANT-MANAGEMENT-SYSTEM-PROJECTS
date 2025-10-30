import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { FaChartLine, FaTable, FaListAlt, FaPlus } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaChartLine className="nav-icon" title="Analytics" />
        </NavLink>

        <NavLink
          to="/tables"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaTable className="nav-icon" title="Tables" />
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaListAlt className="nav-icon" title="Orders" />
        </NavLink>

        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaPlus className="nav-icon" title="Add Product" />
        </NavLink>
      </nav>
    </aside>
  );
}
