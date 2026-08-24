import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import medicineRoutes from "../routes/medicineRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
  }

  cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  return cachedConnection;
};

// Test route WITHOUT MongoDB
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Homeopathic Inventory API is running",
  });
});

// API test
app.get("/api", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "API is working",
      database: "MongoDB connected",
    });
  } catch (error) {
    console.error("MongoDB ERROR:", error);

    res.status(500).json({
      success: false,
      message: "MongoDB connection failed",
      error: error.message,
    });
  }
});

// Medicine API
app.use("/api/medicines", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
}, medicineRoutes);

export default app;