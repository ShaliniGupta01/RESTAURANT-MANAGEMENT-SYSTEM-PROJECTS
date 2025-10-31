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
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Final Response ---
    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalClients: totalOrders, // you can change this if client model exists
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
