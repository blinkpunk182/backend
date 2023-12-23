import mongoose from "mongoose";

const tutoradoSchema = new mongoose.Schema({
  cedula: String,
  nombre: String,
  apellido: String,
  telefono: String,
  direccion: String,
  codigoTutorado: String,
  estado: String,
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  perimetro: [
    {
      type: [Number],
    },
  ],
  ubicacion: Object,
  fechaEnvioEmail: Date,
});

const Tutorado = mongoose.model("Tutorado", tutoradoSchema);

export default Tutorado;
