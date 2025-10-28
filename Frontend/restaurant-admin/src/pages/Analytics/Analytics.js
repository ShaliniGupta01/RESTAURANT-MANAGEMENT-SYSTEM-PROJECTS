import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Analytics.css";
import StatsRow from "./StatsRow";
import OrderSummary from "./OrderSummary";
import RevenueChart from "./RevenueChart";
import TablesOverview from "./TablesOverview";
import ChefPerformance from "./ChefPerformance";

export default function Analytics() {
  //  initialize all states with safe defaults
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
  });

  const [orders, setOrders] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
  });

  const [chefPerformance, setChefPerformance] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [filter, setFilter] = useState("Daily");
  const [loading, setLoading] = useState(false);

  const chefs = ["Mohan", "Pritam", "Yash", "Rahul"];

  // Function to simulate assigning random orders to chefs
  const generateChefPerformance = (totalOrders = 20) => {
    const performance = chefs.map((chef) => ({
      name: chef,
      totalOrders: 0,
      served: 0,
      pending: 0,
    }));

    // Randomly assign orders to chefs
    for (let i = 0; i < totalOrders; i++) {
      const randomChef =
        performance[Math.floor(Math.random() * performance.length)];
      randomChef.totalOrders += 1;
    }

    // Simulate served vs pending
    performance.forEach((chef) => {
      chef.served = Math.floor(Math.random() * chef.totalOrders);
      chef.pending = chef.totalOrders - chef.served;
    });

    return performance;
  };

  const fetchAnalyticsData = async (selectedFilter) => {
    try {
      setLoading(true);
      const response = await API.get(
        `/analytics?filter=${selectedFilter.toLowerCase()}`
      );
      const data = response.data || {};

      //  safely update states
      setStats(data.stats || {});
      setOrders(data.orders || {});
      setRevenueData(data.revenue || []);

      // simulate chef performance dynamically
      const simulatedChefPerformance = generateChefPerformance(25);
      setChefPerformance(simulatedChefPerformance);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="analytics-page">
      <h3>Analytics</h3>

      {/* 1. Stats Row */}
      <StatsRow stats={stats} />

      {/* 2. Analytics Grid */}
      <div className="analytics-grid">
        {/* Order Summary */}
        <OrderSummary
          served={orders?.served || 0}
          dineIn={orders?.dineIn || 0}
          takeAway={orders?.takeAway || 0}
          filter={filter}
          setFilter={setFilter}
        />

        {/* Revenue Chart */}
        <RevenueChart
          lineData={revenueData}
          revenueFilter={filter}
          setRevenueFilter={setFilter}
        />

        {/* Tables Overview */}
        <TablesOverview />
      </div>

      {/* 3. Chef Performance */}
      <ChefPerformance chefPerformance={chefPerformance} />

      {loading && (
        <p style={{ textAlign: "center", fontSize: "12px" }}>Loading data...</p>
      )}
    </div>
  );
}