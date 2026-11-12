

import express, { type Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-record.js"
import cors from "cors";

const app: Express = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(cors());

const mongoURI: string = "";

mongoose
    .connect(mongoURI)
    .then(() => console.log("CONNECTED TO MONGODB!"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server Running on Port ${port}`);
});
