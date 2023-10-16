import { DB } from "../config/db.js";

import { createErrorPromise } from "../utils/errorManager.js";

export const create = async (schema, data, options) => {
  try {
    const uuid = DB.GenUUID();
    data._key = uuid;
    data._id = schema.modelName + "/" + data._key;
    return { _result: await schema.create(data, options) };
  } catch (e) {
    return createErrorPromise(e);
  }
};

export const createSome = async (schema, data, options) => {
  try {
    let newData = [];
    for (let item of data) {
      const uuid = DB.GenUUID();
      item._key = uuid;
      item._id = schema.modelName + "/" + item._key;
      newData.push(item);
    }
    return await schema.insertMany(newData, options);
  } catch (e) {
    return createErrorPromise(e);
  }
};

export const update = async (schema, filter, data, options) => {
  try {
    return { _result: await schema.updateOne(filter, data, options) };
  } catch (e) {
    return createErrorPromise(e);
  }
};
export const remove = async (schema, filter, options) => {
  try {
    return { _result: await schema.deleteOne(filter, options) };
  } catch (e) {
    return createErrorPromise(e);
  }
};

export const find = async (schema, filter, options) => {
  try {
    return { _result: await schema.find(filter, options) };
  } catch (e) {
    return createErrorPromise(e);
  }
};

export const findAll = async (table, options) => {
  try {
    return {
      _result: await DB.mongo.collection(table).find({}, options).toArray(),
    };
  } catch (e) {
    return createErrorPromise(e);
  }
};

export const replace = async (schema, filter, data, options) => {
  try {
    return schema.replaceOne(filter, data, options);
  } catch (e) {
    return createErrorPromise(e);
  }
};

export const query = (aql) => {
  return DB.query(aql).catch((e) => {
    return createErrorPromise(e);
  });
};
