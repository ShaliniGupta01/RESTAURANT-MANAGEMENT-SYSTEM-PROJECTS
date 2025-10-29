import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import orderRoutes from "./routes/orderRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Load environment variables
dotenv.config({ quiet: true });

// Initialize Express app
const app = express();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
      origin: [
      "https://restaurant-management-system-projects-admin-h4hh6lk0i.vercel.app/analytics",
      "https://restaurant-management-syste-git-9f0d8c-shalinigupta01s-projects.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Connect to MongoDB
connectDB();

// API routes
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