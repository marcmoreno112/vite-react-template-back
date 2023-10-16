import { DB } from "../config/db.js";
import {
  createErrorPromise,
  createSimpleErrorPromise,
} from "../utils/errorManager.js";

export const createUser = async (schema, user) => {
  try {
    const uuid = DB.GenUUID(); // str(uuid.UUID4());//bcrypt.hash(str(uuid.UUID4()), bcrypt.gensalt(10));
    user._id = "Users/" + uuid;
    user._key = uuid;
    return { _result: await schema.create(user) };
  } catch (e) {
    console.log("DB createUser Failed {");
    console.log(e);
    console.log("}");
    return createSimpleErrorPromise(e.response.body);
  }

  // return collection.save(user).catch(e => {
  // 	return createSimpleErrorPromise(e.response.body);
  // });
};
