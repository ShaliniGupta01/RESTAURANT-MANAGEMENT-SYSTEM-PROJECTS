

import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";
import Table from "../models/tableModel.js";

// Assign chef with least handled orders
const assignChef = async () => {
  const chefs = await Chef.find().sort({ ordersHandled: 1 });
  if (chefs.length === 0) {
    console.log("No chefs available for assignment");
    return null;
  }

  const assignedChef = chefs[0];
  console.log(`Assigning order to chef: ${assignedChef.name}, current ordersHandled: ${assignedChef.ordersHandled}`);
  assignedChef.ordersHandled += 1;
  await assignedChef.save();
  console.log(`Chef ${assignedChef.name} updated, new ordersHandled: ${assignedChef.ordersHandled}`);
  return assignedChef.name;
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    let {
      orderId,
      type,
      items,
      totalAmount,
      tableNumber,
      clientName,
      phoneNumber,
      address,
      instructions,
      totals,
      user,
    } = req.body;

    console.log(`Received order type: ${type}`);

    // Handle totals from frontend
    if (!totalAmount && totals?.grandTotal) {
      totalAmount = Number(totals.grandTotal);
    }

    const mappedItems = (items || []).map((it) => ({
      name: it.name ?? it.id ?? "Item",
      quantity: it.quantity ?? it.qty ?? 1,
      price: it.price ?? it.unitPrice ?? 0,
    }));

    // Assign chef for ALL orders
    const assignedChef = await assignChef();
    console.log(`Order assigned to chef: ${assignedChef} for type: ${type}`);

    // Improved type check
    const normalizedType = type?.toLowerCase().trim();
    const orderType = (normalizedType === "dine in" || normalizedType === "dinein") ? "Dine In" : "Takeaway";
    console.log(`Final order type set to: ${orderType}`);

    const newOrder = await Order.create({
      orderId: orderId || `ODR-${Date.now()}`,
      type: orderType,
      tableNumber: tableNumber ?? null,
      items: mappedItems,
      totalAmount:
        Number(totalAmount) ||
        mappedItems.reduce((sum, i) => sum + i.quantity * i.price, 0),
      clientName: clientName ?? user?.name ?? "",
      phoneNumber: phoneNumber ?? user?.phone ?? "",
      address: address ?? user?.address ?? "",
      instructions: instructions ?? "",
      assignedChef,
      status: "Processing",
      processingTime: Math.floor(Math.random() * 10) + 5,
    });

    // Reserve table ONLY for dine-in
    if (orderType === "Dine In" && newOrder.tableNumber) {
      console.log(`Reserving table ${newOrder.tableNumber} for dine-in`);
      await Table.findOneAndUpdate(
        { tableNumber: Number(newOrder.tableNumber) },
        { reserved: true, $inc: { bookedFor: 1 } },
        { new: true }
      );
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
};

// Assign chefs to existing unassigned orders
export const assignExistingOrders = async (req, res) => {
  try {
    const unassignedOrders = await Order.find({ assignedChef: { $exists: false } });
    console.log(`Found ${unassignedOrders.length} unassigned orders`);

    for (const order of unassignedOrders) {
      const assignedChef = await assignChef();
      if (assignedChef) {
        order.assignedChef = assignedChef;
        await order.save();
        console.log(`Assigned ${assignedChef} to order ${order.orderId}`);
      }
    }

    res.status(200).json({ message: `Assigned chefs to ${unassignedOrders.length} orders` });
  } catch (error) {
    console.error("Error assigning existing orders:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find order either by ObjectId or orderId string
    const order = await Order.findOneAndUpdate(
      { $or: [{ _id: id }, { orderId: id }] },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: error.message });
  }
};