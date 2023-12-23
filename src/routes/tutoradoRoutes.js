import { Router } from "express";
import {
  activeAndDesactive,
  create,
  createPerimetro,
  deletePerimetro,
  getById,
  getByTuthor,
  saveLocation,
  update,
  saveDateEmail,
  sendEmail,
} from "../controllers/tutoradoController.js";

const routerTutorado = Router();
routerTutorado.get("/get-by-tuthor/:tutor", getByTuthor);
routerTutorado.get("/:id", getById);
routerTutorado.post("/", create);
routerTutorado.put("/:idTutorado", update);
routerTutorado.put("/active-and-desactive/:idTutorado", activeAndDesactive);
routerTutorado.put("/createPerimetro/:idTutorado", createPerimetro);
routerTutorado.put("/deletePerimetro/:idTutorado", deletePerimetro);
routerTutorado.put("/saveLocation/:idTutorado", saveLocation);
routerTutorado.get("/send-email/:idTutorado", sendEmail);
routerTutorado.put("/actualizar-fecha-email/:idTutorado", saveDateEmail);
export default routerTutorado;
