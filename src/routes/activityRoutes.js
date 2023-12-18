import { Router } from "express";
import {
  create,
  getAll,
  getInfoDashboard,
} from "../controllers/activityController.js";

const routerActivity = Router();
routerActivity.get("/", getAll);
routerActivity.post("/", create);
routerActivity.get("/get-info-dashboard/:tutor", getInfoDashboard);

export default routerActivity;
