import { User } from "../schemas/userSchema.js";
import { find, update } from "../services/generalQueries.js";
import { createUser } from "../services/authQueries.js";
import bcrypt from "bcryptjs";
import { createErrorWithCode, createError } from "../utils/errorManager.js";
import { loginValidation, registerValidation } from "../validators/user.js";
import {
  createTokenAndCookie,
  unregisterToken,
  verifyToken,
} from "../utils/tokenAndCookie.js";

export const registerUserController = async (req, res) => {
  try {
    console.log("DB /registerUser: Query MongoDB bypassed");

    const userData = req.body;
    // check user is already registered
    const emailExist = await find(User, { email: userData.email });
    if (emailExist._result.length > 0) {
      return res
        .status(+process.env.CODE_API)
        .send(createErrorWithCode(896, "E-mail already exists in the db"));
    }

    userData.isAdmin = false;
    userData.enableUser = true;
    const { error } = registerValidation(userData);
    if (error)
      return res
        .status(process.env.CODE_API)
        .json(createErrorWithCode(898, error.details[0].message));

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashPassword;

    const created = await createUser(User, userData);

    return res.send(created);
  } catch (e) {
    console.log("backend: registerUser catch {");
    console.log(e);
    console.log("}");

    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return res.status(+process.env.CODE_API).json(e);
  }
};

export const loginController = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error)
      return res
        .status(process.env.CODE_API)
        .json(createErrorWithCode(898, error.details[0].message));
    //si el usuario existe
    let userData = await find(User, { email: req.body.email });
    if (userData._result.length === 0) {
      return res
        .status(+process.env.CODE_API)
        .json(createErrorWithCode(896, "E-mail does not exists"));
    }
    //si el password es correcto
    const validPass = await bcrypt.compare(
      req.body.password,
      userData._result[0].password
    );
    if (!validPass)
      return res
        .status(process.env.CODE_API)
        .json(createErrorWithCode(897, "Invalid password!"));
    //elimina el password de la salida de datos
    userData._result[0].password = undefined;
    const payload = {
      sub: userData._result[0]._key,
      iat: Date.now(),
      email: userData._result[0].email,
    };
    const result = await createTokenAndCookie(payload, req, res);
    if (result["error"] === true) {
      return res.status(process.env.CODE_API).json(result);
    }
    res.send(userData._result[0]);
  } catch (e) {
    if (e["code"] === undefined) {
      //error producido por la funcion, NO por una consulta a bds
      e = createError(e.message);
    }
    return res.status(process.env.CODE_API).json(e);
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const userData = req.body;
    const salt = await bcrypt.genSalt(10);
    const userFind = await find(User, {
      email: userData.email,
    });
    let newPasswordHash;
    const checkPassword = await bcrypt.compare(
      userData.oldPassword,
      userFind._result[0].password
    );

    if (userFind._result.length > 0 && checkPassword) {
      newPasswordHash = await bcrypt.hash(userData.password, salt);
    } else {
      return res
        .status(+process.env.CODE_API)
        .json(createErrorWithCode(894, "User does not match!"));
    }

    //UPDATE DEL USER
    const userUpdated = await update(
      User,
      { email: userData.email, password: userFind._result.password },
      { password: newPasswordHash }
    );
    return res.send(userUpdated);
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return res.status(process.env.CODE_API).json(e);
  }
};

export const logoutController = async (req, res) => {
  try {
    const result = await unregisterToken(req.body.email);
    if (result["error"] === true) {
      return res.status(process.env.CODE_API).json(result);
    }
    res.status(202);
    res.clearCookie(process.env.COOKIE_NAME).send();
  } catch (e) {
    if (e["code"] === undefined) {
      //error producido por la funcion, NO por una consulta a bds
      e = createError(e.message);
    }
    return res.status(process.env.CODE_API).json(e);
  }
};

export const currentUserController = async (req, res) => {
  try {
    //la cookie sale descodificada porque el secreto se lo hemos pasado en el cookieParser
    const decrypt = await verifyToken(req, res);
    if (decrypt.payload !== undefined) {
      let userData = await find(User, { email: decrypt.payload.email });
      if (userData._result.length === 0) {
        return res
          .status(+process.env.CODE_API)
          .send(createErrorWithCode(896, "E-mail does not exists"));
      }
      userData._result[0].password = undefined;
      return res.send(userData._result[0]);
    } else {
      return res
        .status(process.env.CODE_API)
        .json(createErrorWithCode(900, decrypt));
    }
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return res.status(process.env.CODE_API).json(e);
  }
};
