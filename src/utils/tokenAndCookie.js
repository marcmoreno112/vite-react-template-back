import jwt from "jsonwebtoken";
import { promisify } from "util";
import { TokenStatus } from "../schemas/tokenStatusSchema.js";
import { create, replace, remove, find } from "../services/generalQueries.js";
import { createError } from "./errorManager.js";
import { User } from "../schemas/userSchema.js";

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
    secure: "http", //req.secure || req.headers["x-forwarded-proto"] === "http" -- cambios para cookie en local
    signed: true,
    sameSite: "none", //strict
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

export async function refreshToken(req, res) {
  try {
    //la cookie sale descodificada porque el secreto se lo hemos pasado en el cookieParser
    const decrypt = await verifyToken(req, res);
    if (decrypt.payload !== undefined) {
      //si el usuario esta loginado el token estara en la lista de tokens
      let tokenData = await find(TokenStatus, {
        email: decrypt.payload.email,
      });
      const token = req.signedCookies[process.env.COOKIE_NAME];
      if (
        tokenData._result.length > 0 &&
        tokenData._result[0].token === token
      ) {
        const payload = {
          sub: decrypt._key,
          iat: Date.now(),
          email: decrypt.payload.email,
        };
        const result = await createTokenAndCookie(payload, req, res);
        if (result["error"] === true) {
          return res.status(+process.env.CODE_API).json(result);
        }
        const userData = await find(User, {
          email: decrypt.payload.email,
        });
        delete userData._result[0].password;
        return res.send(userData._result[0]);
      } else {
        return res
          .status(+process.env.CODE_API)
          .json(createErrorWithCode(899, "Token no coincide"));
      }
    } else {
      return res
        .status(+process.env.CODE_API)
        .json(createErrorWithCode(900, decrypt));
    }
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return res.status(+process.env.CODE_API).json(e);
  }
}
