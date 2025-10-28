import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/analytics
router.get("/", getAnalytics);

export default router;
