import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import API from "../../api/axios";
import "./Analytics.css";
import CardRow from "./CardRow";
import OrderSummary from "./OrderSummary";
import RevenueChart from "./RevenueChart";
import TablesSummary from "./TablesSummary";
import ChefTable from "./ChefTable";
import { useSearch } from "../../context/SearchContext";

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

  // Fetch analytics from backend
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
        setChefPerformance(data.chefs || []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  // Allow parent to trigger refresh
  useImperativeHandle(ref, () => ({
    refresh() {
      fetchAnalyticsData(filter);
    },
  }));

  // Fetch on load or filter change
  useEffect(() => {
    fetchAnalyticsData(filter);
  }, [filter, fetchAnalyticsData]);

  // Blur logic
  const getBlurClass = (section) => {
    if (!searchTerm) return "";

    const term = searchTerm.toLowerCase().trim();

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

    if (term.includes("ordersummary"))
      return section === "orderSummary" ? "" : "blurred";
    if (term.includes("revenue chart"))
      return section === "revenueChart" ? "" : "blurred";
    if (term.includes("tables") || term.includes("table"))
      return section === "tablesOverview" ? "" : "blurred";
    if (term.includes("chef")) return section === "chef" ? "" : "blurred";

    return "";
  };

  return (
    <div className="analytics-page">
      <h3>Analytics</h3>

      <div className={getBlurClass("stats")}>
        <CardRow stats={stats} />
      </div>

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
          <TablesSummary />
        </div>
      </div>

      <div className={getBlurClass("chef")}>
        <ChefTable chefPerformance={chefPerformance} />
      </div>

      {loading && (
        <p style={{ textAlign: "center", fontSize: "12px" }}>Loading data...</p>
      )}
    </div>
  );
});

export default Analytics;
