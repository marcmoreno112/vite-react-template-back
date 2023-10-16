import express from "express";

import {
  loginController,
  registerUserController,
  changePasswordController,
  logoutController,
  currentUserController,
} from "../controllers/userController.js";

export const authRouter = express.Router();

authRouter.post("/registerUser", registerUserController);

authRouter.post("/login", loginController);

authRouter.post("/changePassword", changePasswordController);

authRouter.post("/logout", logoutController);

authRouter.get("/user", currentUserController);
