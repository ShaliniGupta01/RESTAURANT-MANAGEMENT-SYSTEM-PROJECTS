import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

export const getAnalytics = async (req, res) => {
  try {
    // --- Basic Stats ---
    const totalOrders = await Order.countDocuments();
    const totalChefs = await Chef.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const totalClients = await Order.distinct("phoneNumber").then((arr) =>
      arr.filter(Boolean).length
    );

    // --- Status Breakdown ---
    const statusAgg = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$status" } } },
          count: { $sum: 1 },
        },
      },
    ]);

    // --- Type Breakdown ---
    const typeAgg = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$type" } } },
          count: { $sum: 1 },
        },
      },
    ]);

    // --- Served Count ---
    const servedCount = await Order.countDocuments({
      $or: [{ status: /served/i }, { status: /done/i }],
    });

    // --- Orders Summary ---
    const orders = {
      served: servedCount,
      processing:
        statusAgg.find((s) => s._id === "processing")?.count || 0,
      dineIn:
        typeAgg.find((t) => t._id.includes("dine"))?.count || 0,
      takeAway:
        typeAgg.find((t) => t._id.includes("take"))?.count || 0,
    };

    // --- Revenue Series (for chart display) ---
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

    // --- Chef Performance Data ---
    const chefs = await Chef.find({}, "name ordersHandled").sort({
      ordersHandled: -1,
    });

    // --- Final Response ---
    res.json({
      stats: { totalOrders, totalChefs, totalRevenue, totalClients },
      orders,
      revenue,
      chefs, // [{ name, ordersHandled }]
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ message: error.message });
  }
};
