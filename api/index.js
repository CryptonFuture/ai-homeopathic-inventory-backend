import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../config/db.js";

import medicineRoutes
  from "./routes/medicineRoutes.js";


dotenv.config();

const app = express();


app.use(cors());

app.use(
  express.json({
    limit: "10mb"
  })
);


connectDB();


app.get(
  "/",
  (req, res) => {

    res.json({
      success: true,
      message:
        "AI Image Generator API Running"
    });

  }
);


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
      `Backend running on port ${PORT}`
    );

  }
);