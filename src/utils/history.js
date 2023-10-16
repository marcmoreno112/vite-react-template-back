// //TODOOOOOOOOO

// const { createError } = require("./error");
// const { saveLogMessage } = require("../services/log");
// const generalQueries = require("../services/generalQueriesArangoDb");
// async function saveHistory(
//   user,
//   table,
//   processType,
//   result,
//   data,
//   filter,
//   aql
// ) {
//   try {
//     if (
//       result?.code === undefined ||
//       (result?.code === 200 && table !== "Caches" && table !== "Locks")
//     ) {
//       let date = new Date();
//       const resultInsert = await generalQueries.create("history", {
//         date: date,
//         user: user,
//         table: table,
//         processType: processType,
//         result: result,
//         data: data,
//         filter: filter,
//         aql,
//       });
//       return resultInsert;
//     }
//   } catch (e) {
//     if (e["code"] === undefined) {
//       e = createError(e.message);
//       saveLogMessage("error", JSON.stringify(e));
//     }
//     return e;
//   }
// }
// module.exports.saveHistory = saveHistory;
