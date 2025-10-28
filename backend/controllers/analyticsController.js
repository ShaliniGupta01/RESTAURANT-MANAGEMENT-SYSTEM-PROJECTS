import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

export const getAnalytics = async (req, res) => {
  try {
    // Basic stats
    const totalOrders = await Order.countDocuments();
    const totalChefs = await Chef.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    const totalClients = await Order.distinct("phoneNumber")
      .then((arr) => arr.filter(Boolean).length);

    // Order breakdown by status and type
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const typeAgg = await Order.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const orders = {
      served: statusAgg.find((s) => s._id === "Served")?.count || 0,
      processing: statusAgg.find((s) => s._id === "Processing")?.count || 0,
      done: statusAgg.find((s) => s._id === "Done")?.count || 0,
      dineIn: typeAgg.find((t) => t._id === "Dine In")?.count || 0,
      takeAway:
        typeAgg.find((t) => t._id === "Takeaway" || t._id === "Take Away")
          ?.count || 0,
    };

    // Revenue timeseries (last 30 days)
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
      stats: {
        totalOrders,
        totalChefs,
        totalRevenue,
        totalClients,
      },
      orders,
      revenue,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: error.message });
  }
};
