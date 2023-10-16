import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import "./config/db.js";
import { workerRouter, authRouter, tokenRouter } from "./routes/index.js";

const corsOptions = {
  // origin: process.env.APP_URL,
  // credentials: true,
  origin: [process.env.APP_URL, "http://localhost:5173"],
  credentials: true,
};

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

app.use("/api/workers", workerRouter);
app.use("/auth", authRouter);
app.use("/tokenStatusCase", tokenRouter);
