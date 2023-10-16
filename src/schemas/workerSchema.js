import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    _id: {
      required: true,
      type: String,
    },
    _key: {
      required: true,
      type: String,
    },
    ettCode: {
      required: true,
      type: String,
      unique: true,
    },
    name: {
      required: true,
      type: String,
    },
    group: {
      required: true,
      type: String,
    },
    department: {
      required: true,
      type: String,
    },
    date: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export const Worker = mongoose.model("workerList", workerSchema, "workerList");
