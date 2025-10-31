import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

export const getAnalytics = async (req, res) => {
  try {
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
          _id: {
            $toLower: { $trim: { input: "$status" } },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // --- Type Breakdown ---
    const typeAgg = await Order.aggregate([
      {
        $group: {
          _id: {
            $toLower: { $trim: { input: "$type" } },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const getCount = (key) =>
      statusAgg.find((s) => s._id === key.toLowerCase())?.count || 0;

    const servedCount = getCount("served") + getCount("done");

    const orders = {
      served: servedCount,
      processing: getCount("processing"),
      dineIn:
        typeAgg.find((t) => t._id.includes("dine"))?.count || 0,
      takeAway:
        typeAgg.find((t) => t._id.includes("take"))?.count || 0,
    };

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

    res.json({
      stats: { totalOrders, totalChefs, totalRevenue, totalClients },
      orders,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
