import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../utils/constants.js";
import User from "../models/userModel.js";
import Tutorado from "../models/tutoradoModel.js";

export const signUpAdmin = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: "Campos vacios" });
    }

    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ error: "Correo ya está registrado" });
    }

    const hashedPassword = await hash(contrasena, 10);
    req.body.contrasena = hashedPassword;
    req.body.status = "Activo";
    req.body.rol = "ROL_USER";
    const user = await User.create(req.body);

    return res.status(201).json({ message: "Usuario registrado", user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const signInAdmin = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Campos vacios" });
    }
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const passwordMatch = await compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const params = {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
    };
    const token = jwt.sign(params, JWT_KEY, {
      expiresIn: "30d",
    });

    return res.status(200).json({ token, user: params });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const signInTutorado = async (req, res) => {
  try {
    const { codigo } = req.params;

    const tutorado = await Tutorado.findOne({ codigoTutorado: codigo });
    if (!tutorado) {
      return res
        .status(401)
        .json({ error: "Tutorado no esta asociado a un tutor" });
    }

    return res.status(200).json({
      message:
        "Se han sincronizado los datos del tutorado con el tutor, ya puede registrar actividades",
      tutorado,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
