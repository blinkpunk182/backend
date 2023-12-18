import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  mensaje: String,
  fecha: String,
  tutorado: { type: mongoose.Schema.Types.ObjectId, ref: "Tutorado" },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
