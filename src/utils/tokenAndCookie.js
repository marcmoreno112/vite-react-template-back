import jwt from "jsonwebtoken";
import { promisify } from "util";
import { TokenStatus } from "../schemas/tokenStatusSchema.js";
import { create, replace, remove } from "../services/generalQueries.js";
import { createError } from "./errorManager.js";

export async function createTokenAndCookie(payload, req, res) {
  try {
    const token = signToken(payload);
    const dateExpireToken = createCookie(token, req, res);
    const result = await registerToken(payload.email, dateExpireToken, token);
    return result;
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return e;
  }
}

function signToken(payload) {
  return jwt.sign({ payload }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN * 60000,
  });
}

function createCookie(token, req, res) {
  let dateExpire = new Date();
  dateExpire.setTime(
    dateExpire.getTime() + process.env.COOKIE_EXPIRES_IN * 60000
  );
  res.cookie(process.env.COOKIE_NAME, token, {
    expires: dateExpire,
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "http",
    signed: true,
    sameSite: "strict",
    session: true,
    overwrite: true,
  });
  return dateExpire;
}

async function registerToken(email, dateExpireToken, token) {
  try {
    const regToken = {
      email: email,
      dateExpireToken: dateExpireToken,
      token: token,
    };

    let createdTokensStatus = await replace(
      TokenStatus,
      { email: email },
      regToken
    );

    if (createdTokensStatus.modifiedCount === 0) {
      createdTokensStatus = await create(TokenStatus, regToken);
    }
    return createdTokensStatus;
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return e;
  }
}

export async function unregisterToken(email) {
  try {
    const unregToken = {
      email: email,
    };
    const createdTokensStatus = await remove(TokenStatus, unregToken);
    return createdTokensStatus;
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return e;
  }
}

export async function verifyToken(req, res) {
  return { payload: 1 };
  if (req.signedCookies[process.env.COOKIE_NAME] !== undefined) {
    const token = req.signedCookies[process.env.COOKIE_NAME];
    try {
      const decrypt = await promisify(jwt.verify)(
        token,
        process.env.TOKEN_SECRET
      );
      return decrypt;
    } catch (e) {
      return "Token expired";
    }
  } else {
    return "Cookie expired";
  }
}
