import "dotenv/config";

import express, { type Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-record.js";
import cors from "cors";

const app: Express = express();
const port = Number(process.env.PORT) || 3001;

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error("MONGODB_URI não configurada!");
}

app.use(express.json());
app.use(cors());

app.use("/financial-records", financialRecordRouter);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("CONNECTED TO MONGODB!");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server Running on Port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });