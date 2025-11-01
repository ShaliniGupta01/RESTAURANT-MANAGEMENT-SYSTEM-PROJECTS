
import express from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  assignExistingOrders, // New function import
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.post("/assign-existing", assignExistingOrders); // New route for assigning existing orders
router.patch("/:id", updateOrderStatus);

export default router;