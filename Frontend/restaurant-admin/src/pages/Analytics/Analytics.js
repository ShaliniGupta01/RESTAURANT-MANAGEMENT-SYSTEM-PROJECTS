import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import API from "../../api/axios";
import "./Analytics.css";
import StatsRow from "./StatsRow";
import OrderSummary from "./OrderSummary";
import RevenueChart from "./RevenueChart";
import TablesOverview from "./TablesOverview";
import ChefPerformance from "./ChefPerformance";
import { useSearch } from "../../context/SearchContext";

// forwardRef allows parent (AdminDashboard) to call refresh()
const Analytics = forwardRef((props, ref) => {
  const { searchTerm } = useSearch();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
  });

  const [orders, setOrders] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
    done: 0,
  });

  const [chefPerformance, setChefPerformance] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [filter, setFilter] = useState("Daily");
  const [loading, setLoading] = useState(false);

  //  Generate random chef performance (mock data)
  const generateChefPerformance = useCallback((totalOrders = 20) => {
    const chefs = ["Mohan", "Pritam", "Yash", "Rahul"];

    const performance = chefs.map((chef) => ({
      name: chef,
      totalOrders: 0,
      served: 0,
      pending: 0,
    }));

    for (let i = 0; i < totalOrders; i++) {
      const randomChef =
        performance[Math.floor(Math.random() * performance.length)];
      randomChef.totalOrders += 1;
    }

    performance.forEach((chef) => {
      chef.served = Math.floor(Math.random() * chef.totalOrders);
      chef.pending = chef.totalOrders - chef.served;
    });

    return performance;
  }, []);

  //  Fetch analytics from backend
  const fetchAnalyticsData = useCallback(
    async (selectedFilter = filter) => {
      try {
        setLoading(true);
        const response = await API.get(
          `/api/analytics?filter=${selectedFilter.toLowerCase()}`
        );

        const data = response.data || {};
        setStats(data.stats || {});
        setOrders(data.orders || {});
        setRevenueData(data.revenue || []);
        setChefPerformance(generateChefPerformance(25));
      } catch (error) {
        console.error(" Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    },
    [generateChefPerformance, filter]
  );

  //  Allow parent (AdminDashboard) to trigger a refresh instantly
  useImperativeHandle(ref, () => ({
    refresh() {
      fetchAnalyticsData(filter);
    },
  }));

  //  Fetch on load or filter change
  useEffect(() => {
    fetchAnalyticsData(filter);
  }, [filter, fetchAnalyticsData]);

  //  Blur logic (for SearchContext)
  const getBlurClass = (section) => {
    if (!searchTerm) return ""; // show all if empty

    const term = searchTerm.toLowerCase().trim();

    // --- Show only StatsRow for "total" searches ---
    if (
      term === "total" ||
      term.includes("total chef") ||
      term.includes("total order") ||
      term.includes("total revenue") ||
      term.includes("total client") ||
      term.includes("total clients")
    ) {
      return section === "stats" ? "" : "blurred";
    }

    // --- Section-specific searches ---
    if (term.includes("ordersummary"))
      return section === "orderSummary" ? "" : "blurred";
    if (term.includes("revenue chart"))
      return section === "revenueChart" ? "" : "blurred";
    if (term.includes("tables") || term.includes("table"))
      return section === "tablesOverview" ? "" : "blurred";
    if (term.includes("chef")) return section === "chef" ? "" : "blurred";

    // Default: show all
    return "";
  };

  return (
    <div className="analytics-page">
      <h3>Analytics</h3>

      {/* === Stats Row === */}
      <div className={getBlurClass("stats")}>
        <StatsRow stats={stats} />
      </div>

      {/* === Analytics Grid === */}
      <div className="analytics-grid">
        <div className={getBlurClass("orderSummary")}>
          <OrderSummary
            served={orders?.served || 0}
            dineIn={orders?.dineIn || 0}
            takeAway={orders?.takeAway || 0}
            filter={filter}
            setFilter={setFilter}
          />
        </div>

        <div className={getBlurClass("revenueChart")}>
          <RevenueChart
            lineData={revenueData}
            revenueFilter={filter}
            setRevenueFilter={setFilter}
          />
        </div>

        <div className={getBlurClass("tablesOverview")}>
          <TablesOverview />
        </div>
      </div>

      {/* === Chef Performance === */}
      <div className={getBlurClass("chef")}>
        <ChefPerformance chefPerformance={chefPerformance} />
      </div>

      {loading && (
        <p style={{ textAlign: "center", fontSize: "12px" }}>
          Loading data...
        </p>
      )}
    </div>
  );
});

export default Analytics;