import { Worker } from "../schemas/workerSchema.js";
import { createErrorWithCode } from "../utils/errorManager.js";
import {
  findController,
  createController,
  updateController,
  removeController,
} from "./commonControllers.js";

export const addDataWorkers = async (req, res) => {
  try {
    createController(req, res, Worker);
  } catch (error) {
    res.status(error.code).json(createErrorWithCode(error.code, error.message));
  }
};

export const getAllWorkersData = async (req, res) => {
  try {
    findController(req, res, Worker);
  } catch (error) {
    res.status(error.code).json(createErrorWithCode(error.code, error.message));
  }
};

//no usable, ver si queremos el id en los params o si son filtros del body se gestionan con el metodo de getAllWorkersData
export const getWorkerDataById = async (req, res) => {
  try {
    findController(req, res, Worker);
  } catch (error) {
    res.status(error.code).json(createErrorWithCode(error.code, error.message));
  }
};

export const updateWorker = async (req, res) => {
  try {
    updateController(req, res, Worker);
  } catch (error) {
    res.status(error.code).json(createErrorWithCode(error.code, error.message));
  }
};

export const removeWorker = async (req, res) => {
  try {
    removeController(req, res, Worker);
  } catch (error) {
    res.status(error.code).json(createErrorWithCode(error.code, error.message));
  }
};
