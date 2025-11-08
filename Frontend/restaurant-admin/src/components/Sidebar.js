import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import analyticsIcon from "../Assets/analytics.png";
import tablesIcon from "../Assets/tables.png";
import ordersIcon from "../Assets/orders.png";
import addIcon from "../Assets/add.png";
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
          <img src={analyticsIcon} alt="Analytics" className="nav-icon" />
        </NavLink>

        <NavLink
          to="/tables"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <img src={tablesIcon} alt="Tables" className="nav-icon" />
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <img src={ordersIcon} alt="Orders" className="nav-icon" />
        </NavLink>

        <NavLink
          to="/admin-menu"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <img src={addIcon} alt="Add Product" className="nav-icon" />
        </NavLink>

        
        <NavLink
          to="#"
          onClick={(e) => e.preventDefault()}
          className="nav-item logout-link"
        >
          {/* <img  alt="Logout" className="nav-icon" /> */}
        </NavLink>
      </nav>
    </aside>
  );
}