import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB Connected");

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    isConnected = false;
    throw error;
  }
};

export default connectDB;