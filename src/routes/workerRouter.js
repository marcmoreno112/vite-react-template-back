import express from "express";
import {
  addDataWorkers,
  getAllWorkersData,
  getWorkerDataById,
  updateWorker,
  removeWorker,
} from "../controllers/workersController.js";

export const workerRouter = express.Router();

// workerRouter
//   .route("/")
//   .get(getAllWorkersData)
//   .post(addDataWorkers)
//   .patch(updateWorker)
//   .delete(removeWorker);

workerRouter.post("/", addDataWorkers);

workerRouter.post("/getData", getAllWorkersData);

workerRouter.get("/:id", getWorkerDataById);

workerRouter.post("/updateData", updateWorker);

// workerRouter.delete("/deleteData", removeWorker);
workerRouter.post("/deleteData", removeWorker);
