import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  fechaInicio: Date,
  fechaFin: Date,
  tutorado: { type: mongoose.Schema.Types.ObjectId, ref: "Tutorado" },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
