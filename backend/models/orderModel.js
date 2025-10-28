import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    type: { type: String, enum: ["Dine In", "Takeaway"], required: true },
    tableNumber: { type: Number },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    clientName: String,
    phoneNumber: String,
    address: String,
    instructions: String,
    status: {
      type: String,
      enum: ["Processing", "Done", "Served", "Not Picked Up"],
      default: "Processing",
    },
    assignedChef: { type: String },
    processingTime: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
