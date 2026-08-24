import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import medicineRoutes from "./routes/medicineRoutes.js";


dotenv.config();

const app = express();


connectDB();


app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

  res.json({
    message:
      "AI Homeopathic Inventory API Running"
  });

});


app.use(
  "/api/medicines",
  medicineRoutes
);


const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);