import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      required: true,
      type: String,
    },
    _key: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    isAdmin: {
      required: true,
      type: Boolean,
    },
    enableUser: {
      required: true,
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("users", userSchema, "users");
