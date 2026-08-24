import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import medicineRoutes from "../routes/medicineRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;

  console.log("MongoDB Connected");
};

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Homeopathic Inventory API",
  });
});

// API health
app.get("/api", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "API is working",
      database: "MongoDB Connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "MongoDB connection failed",
      error: error.message,
    });
  }
});

// Medicine routes
app.use("/api/medicines", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
}, medicineRoutes);

export default app;