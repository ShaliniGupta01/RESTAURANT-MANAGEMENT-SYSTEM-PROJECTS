import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    tableName: { type: String },
    size: { type: Number, enum: [2, 4, 6, 8], required: true },
    reserved: { type: Boolean, default: false },
    bookedFor: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);
export default Table;
