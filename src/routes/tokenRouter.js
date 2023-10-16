import express from "express";

import { refreshToken } from "../utils/tokenAndCookie.js";

export const tokenRouter = express.Router();

tokenRouter.get("/refreshToken", refreshToken);
