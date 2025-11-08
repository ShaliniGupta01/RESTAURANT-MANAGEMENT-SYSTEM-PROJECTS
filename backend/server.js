import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";

import orderRoutes from "./routes/orderRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config({quiet:true});

const app = express();


// Ensure uploads directory exists
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(" 'uploads' folder created automatically");
}


//  FIXED CORS CONFIG
app.use(
  cors({
    origin: [
      "https://restaurant-management-system-projec.vercel.app",
      "https://restaurant-management-system-projec-ten.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

//  OPTIONS route for preflight
app.options(/.*/, cors());


// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect DB
connectDB();

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ success: true, message: "🍽 Restaurant API is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
