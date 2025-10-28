import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";
import Table from "../models/tableModel.js";

// Assign chef with fewer orders
const assignChef = async () => {
  const chefs = await Chef.find().sort({ ordersHandled: 1 });
  if (chefs.length === 0) return null;

  const assignedChef = chefs[0];
  assignedChef.ordersHandled += 1;
  await assignedChef.save();
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

    // If frontend sent totals.grandTotal, use it
    if (!totalAmount && totals && totals.grandTotal) {
      totalAmount = Number(totals.grandTotal);
    }

    // Map items to schema { name, quantity, price }
    const mappedItems = (items || []).map((it) => {
      // admin might send { name, quantity, price } already
      if (it.name && (it.quantity !== undefined || it.qty !== undefined)) {
        return {
          name: it.name,
          quantity: it.quantity ?? it.qty ?? 1,
          price: it.price ?? it.unitPrice ?? 0,
        };
      }
      // if item id only or other loose shape, fallback:
      return {
        name: it.name ?? it.id ?? "Item",
        quantity: it.qty ?? it.quantity ?? 1,
        price: it.price ?? 0,
      };
    });

    const assignedChef = await assignChef();

    // Create order document with required fields
    const newOrder = await Order.create({
      orderId: orderId || `ODR-${Date.now()}`,
      type: type || "Takeaway",
      tableNumber: tableNumber ?? null,
      items: mappedItems,
      totalAmount: Number(totalAmount) || mappedItems.reduce((s, i) => s + i.quantity * i.price, 0),
      clientName: clientName ?? user?.name ?? "",
      phoneNumber: phoneNumber ?? user?.phone ?? "",
      address: address ?? user?.address ?? "",
      instructions: instructions ?? "",
      assignedChef,
      status: "Processing",
      processingTime: Math.floor(Math.random() * 10) + 5, // random countdown in minutes
    });

    // If Dine In, try to mark table reserved and increment bookedFor
    if ((type === "Dine In" || type === "DineIn" || req.body.orderType === "Dine In") && tableNumber) {
      try {
        const t = await Table.findOneAndUpdate(
          { tableNumber: Number(tableNumber) },
          { reserved: true, $inc: { bookedFor: 1 } },
          { new: true }
        );
        // ignore if fail
      } catch (e) {
        // ignore
      }
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
