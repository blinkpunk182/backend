import { Router } from "express";
import {
  signInAdmin,
  signInTutorado,
  signUpAdmin,
} from "../controllers/authController.js";

const routerAuth = Router();

routerAuth.post("/signup", signUpAdmin);
routerAuth.post("/signin", signInAdmin);
routerAuth.post("/signin-tutorado/:codigo", signInTutorado);

export default routerAuth;
