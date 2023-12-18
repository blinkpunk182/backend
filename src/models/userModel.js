import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  cedula: String,
  nombre: String,
  apellido: String,
  correo: String,
  contrasena: String,
  telefono: String,
  direccion: String,
  status: String,
  rol: String,
});

const User = mongoose.model("User", userSchema);

export default User;
