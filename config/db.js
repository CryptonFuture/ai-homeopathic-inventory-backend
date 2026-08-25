import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Agar already connected hai to dobara connect na kare
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    return connection;

  } catch (error) {
    console.error("MongoDB Error:", error.message);

    // Vercel mein process.exit(1) use na karein
    throw error;
  }
};

export default connectDB;