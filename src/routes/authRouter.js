import express from "express";

import {
  loginController,
  registerUserController,
  updatePasswordController,
  logoutController,
  currentUserController,
  findUserByEmail,
} from "../controllers/userController.js";

export const authRouter = express.Router();

authRouter.post("/registerUser", registerUserController);

authRouter.post("/loginUser", loginController);

authRouter.post("/updatePasswordUser", updatePasswordController);

authRouter.post("/logoutUser", logoutController);

authRouter.get("/user", currentUserController);

authRouter.post("findUserNotLogin", findUserByEmail);
