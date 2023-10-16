import mongoose from "mongoose";

const tokensStatusSchema = new mongoose.Schema(
  {
    _id: {
      required: true,
      type: String,
    },
    _key: {
      required: true,
      type: String,
    },
    dateExpireToken: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    token: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export const TokenStatus = mongoose.model(
  "tokenStatus",
  tokensStatusSchema,
  "tokenStatus"
);
