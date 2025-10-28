import Table from "../models/tableModel.js";

// Get all tables
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add table
export const addTable = async (req, res) => {
  try {
    const { size, tableName } = req.body;
    const totalTables = await Table.countDocuments();
    const table = await Table.create({
      tableNumber: totalTables + 1,
      size,
      tableName,
    });
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete table (only if not reserved)
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    if (table.reserved) return res.status(400).json({ message: "Cannot delete reserved table" });

    await table.deleteOne();

    // Reorder table numbering
    const allTables = await Table.find().sort({ createdAt: 1 });
    for (let i = 0; i < allTables.length; i++) {
      allTables[i].tableNumber = i + 1;
      await allTables[i].save();
    }

    res.json({ message: "Table deleted & reordered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update table reservation or details
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { reserved, bookedFor } = req.body;
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { reserved, bookedFor },
      { new: true }
    );
    res.json(updatedTable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};















