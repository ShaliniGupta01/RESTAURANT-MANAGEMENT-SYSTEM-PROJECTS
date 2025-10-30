import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

export const getAnalytics = async (req, res) => {
  try {
    // --- Basic stats ---
    const totalOrders = await Order.countDocuments();
    const totalChefs = await Chef.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const totalClients = await Order.distinct("phoneNumber").then((arr) =>
      arr.filter(Boolean).length
    );

    // --- Order breakdown by status ---
    const statusAgg = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    // --- Order breakdown by type ---
    const typeAgg = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Helper: safely get count for any status key
    const getCount = (key) =>
      statusAgg.find((s) => s._id === key.toLowerCase())?.count || 0;

    //  Combine both “served” and “done” as “served”
    const servedCount = getCount("served") + getCount("done");

    // --- Construct order summary ---
    const orders = {
      served: servedCount,
      processing: getCount("processing"),
      done: getCount("done"),
      dineIn:
        typeAgg.find((t) => t._id === "dine in" || t._id === "dinein")?.count ||
        0,
      takeAway:
        typeAgg.find(
          (t) => t._id === "takeaway" || t._id === "take away"
        )?.count || 0,
    };

    // --- Revenue (last 30 days) ---
    const revenueSeries = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const revenue = revenueSeries.map((r) => ({
      name: r._id,
      value: r.total,
    }));

    // --- Final Response ---
    res.json({
      stats: { totalOrders, totalChefs, totalRevenue, totalClients },
      orders,
      revenue,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: error.message });
  }
};
