import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import medicineRoutes
  from "./routes/medicineRoutes.js";


dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {

    console.log('connected with MongoDB database');

});

mongoose.connection.on('error', (error) => {

    console.log('connection fail');
    console.log(error);

});



app.use(cors());

app.use(
  express.json({
    limit: "10mb"
  })
);


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