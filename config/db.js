import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 60000,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,

        // Query buffering timeout
        bufferTimeoutMS: 60000,
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