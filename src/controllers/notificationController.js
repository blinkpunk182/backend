import mongoose from "mongoose";
import Notification from "../models/notificationModel.js";

export const createAlertPerimeter = async (req, res) => {
  try {
    const { tutorado, mensaje, fecha } = req.body;

    if (!tutorado || !mensaje || !fecha) {
      return res
        .status(400)
        .json({ error: "Asegurese de llenar toda la información" });
    }

    const notificacion = new Notification(req.body);
    await notificacion.save();
    res.status(201).json(notificacion);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getByTutor = async (req, res) => {
  try {
    const notificaciones = await Notification.aggregate([
      {
        $lookup: {
          from: "tutorados",
          localField: "tutorado",
          foreignField: "_id",
          as: "tutorado",
        },
      },
      {
        $match: {
          "tutorado.tutor": mongoose.Types.ObjectId(req.params.tutor),
          "tutorado.estado": "Activo",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 5,
      },
    ]).exec();

    res.json(notificaciones);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getAll = async (req, res) => {
  try {
    const activity = await Notification.find({
      tutorado: req.params.idTutorado,
    });
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
