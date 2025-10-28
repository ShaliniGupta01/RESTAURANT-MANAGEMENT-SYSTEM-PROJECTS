import mongoose from "mongoose";

const chefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ordersHandled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Chef = mongoose.model("Chef", chefSchema);
export default Chef;
