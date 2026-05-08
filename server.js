import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import schoolRoutes from "./routes/schoolRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", schoolRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "School Management API is running" });
});

// Start server after connecting to database
const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
  });
};

startServer();
