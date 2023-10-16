// const generalQueries = require('../services/generalQueriesArangoDb');
import { createError, createErrorWithCode } from "../utils/errorManager.js";
import { verifyToken } from "../utils/tokenAndCookie.js";
import {
  find,
  create,
  createSome,
  update,
  remove,
} from "../services/generalQueries.js";

export async function createController(req, res, table) {
  try {
    const decrypt = await verifyToken(req, res);
    if (decrypt.payload !== undefined) {
      const options = req.body.options;
      let data = req.body.data;
      Object.keys(data).map((key) => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });
      if (data.length === 1) {
        data = await create(table, data, options);
      } else {
        data = await createSome(table, data, options);
      }
      return res.send(data);
    } else {
      return res
        .status(process.env.CODE_API)
        .json(createErrorWithCode(900, decrypt));
    }
  } catch (e) {
    if (e["code"] === undefined) {
      e = createError(e.message);
    }
    return res.status(+process.env.CODE_API).json(e);
  }
}

export async function updateController(req, res, table) {
  try {
    const decrypt = await verifyToken(req, res);
    if (decrypt.payload !== undefined) {
      const options = req.body.options;
      let data = req.body.data;
      let filter = req.body.filter;
      Object.keys(filter).map((key) => {
        if (filter[key] === undefined) {
          delete filter[key];
        }
      });
      Object.keys(data).map((key) => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });
      data = await update(table, filter, data, options);
      return res.send(data);
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
}

export async function findController(req, res, table) {
  try {
    const decrypt = await verifyToken(req, res);
    if (decrypt.payload !== undefined) {
      const options = req.body.options;
      let data;
      let filter = req.body.filter || {};
      Object.keys(filter).map((key) => {
        if (filter[key] === undefined) {
          delete filter[key];
        }
      });

      data = await find(table, filter, options);
      return res.send(data);
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
}

export async function removeController(req, res, table) {
  try {
    const decrypt = await verifyToken(req, res);
    if (decrypt.payload !== undefined) {
      const options = req.body.options;
      let data;
      let filter = req.body.filter;
      Object.keys(filter).map((key) => {
        if (filter[key] === undefined) {
          delete filter[key];
        }
      });
      data = await remove(table, filter, options);
      return res.send(data);
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
}

// async function findAllController(req, res, table) {
//   try {
//     const decrypt = await verifyToken(req, res);
//     if (decrypt.payload !== undefined) {
//       const options = req.body.options;
//       let data;
//       data = await generalQueries.findAll(table, options);
//       return res.send(data);
//     } else {
//       return res
//         .status(process.env.CODE_API)
//         .json(createErrorWithCode(900, decrypt));
//     }
//   } catch (e) {
//     if (e["code"] === undefined) {
//       e = createError(e.message);
//     }
//     return res.status(process.env.CODE_API).json(e);
//   }
// }

// async function queryController(req, res) {
//   try {
//     const decrypt = await verifyToken(req, res);
//     if (decrypt.payload !== undefined) {
//       let data = req.body.query;
//       data = await generalQueries.query(data);
//       return res.send(data);
//     } else {
//       return res
//         .status(process.env.CODE_API)
//         .json(createErrorWithCode(900, decrypt));
//     }
//   } catch (e) {
//     if (e["code"] === undefined) {
//       e = createError(e.message);
//     }
//     return res.status(process.env.CODE_API).json(e);
//   }
// }
