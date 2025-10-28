import express from "express";
import { getChefs, addChef } from "../controllers/chefController.js";

const router = express.Router();

router.get("/", getChefs);
router.post("/", addChef);

export default router;
