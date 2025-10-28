import express from "express";
import { upload } from "../config/multer.js";
import { addMenuItem, getAllMenuItems } from "../controllers/menuController.js";

const router = express.Router();

//  POST /api/menu - Add a new menu item
router.post("/", upload.single("image"), addMenuItem);

// GET /api/menu - Get all menu items
router.get("/", getAllMenuItems);


export default router;
