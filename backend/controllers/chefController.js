import Chef from "../models/chefModel.js";

// Get all chefs
export const getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ ordersHandled: 1 });
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Add new chef
export const addChef = async (req, res) => {
  try {
    const { name } = req.body;
    const chef = await Chef.create({ name });
    res.status(201).json(chef);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

