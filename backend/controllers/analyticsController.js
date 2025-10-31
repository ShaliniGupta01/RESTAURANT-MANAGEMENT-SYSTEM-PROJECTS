import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

export const getAnalytics = async (req, res) => {
  try {
    const { filter } = req.query;

    // --- Basic Stats ---
    const totalOrders = await Order.countDocuments();
    const totalChefs = await Chef.countDocuments();

    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue =
      totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    // --- Order Type Counts ---
    const served = await Order.countDocuments({ status: "Served" });
    const dineIn = await Order.countDocuments({ type: "Dine In" });
    const takeAway = await Order.countDocuments({ type: "Take Away" });

    // --- Revenue by Date (for chart) ---
    const revenueAgg = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          value: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Format revenue data for frontend chart
    const revenue = revenueAgg.map((r) => ({
      name: r._id,
      value: r.value,
    }));

    // --- Final Response ---
    res.json({
      stats: {
        totalOrders,
        totalChefs,
        totalRevenue,
        totalClients: totalOrders, // optional
      },
      orders: {
        served,
        dineIn,
        takeAway,
      },
      revenue,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
