import express from "express";
import { getTables, addTable, deleteTable, updateTable } from "../controllers/tableController.js";

const router = express.Router();

router.get("/", getTables);
router.post("/", addTable);
router.delete("/:id", deleteTable);
router.put("/:id", updateTable);


export default router;
