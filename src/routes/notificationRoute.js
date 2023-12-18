import { Router } from "express";
import {
  createAlertPerimeter,
  getAll,
  getByTutor,
} from "../controllers/notificationController.js";

const routerNotification = Router();
routerNotification.post("/", createAlertPerimeter);
routerNotification.get("/get-by-tutor/:tutor/:limit", getByTutor);
routerNotification.get("/:idTutorado", getAll);

export default routerNotification;
