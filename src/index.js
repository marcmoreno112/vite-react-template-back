import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import "./config/db.js";
import { workerRouter, authRouter } from "./routes/index.js";

const corsOptions = {
  // origin: process.env.APP_URL,
  // credentials: true,
};

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

app.use("/api/workers", workerRouter);
app.use("/auth", authRouter);
