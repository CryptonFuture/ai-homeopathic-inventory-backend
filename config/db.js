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
        // MongoDB server ko select/connect karne ke liye 60 seconds
        serverSelectionTimeoutMS: 60000,

        // Initial connection ke liye 60 seconds
        connectTimeoutMS: 60000,

        // Socket inactivity timeout 60 seconds
        socketTimeoutMS: 60000,
      }
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    return connection;

  } catch (error) {
    console.error("MongoDB Error:", error.message);
    throw error;
  }
};

export default connectDB;