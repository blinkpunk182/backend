import Activity from "../models/activityModel.js";
import {
  getActividadesPorTutorado,
  getTop5,
  getTotalActividadesRegistradas,
  getTotalCategoriasRegistradas,
  getTotalTutorados,
} from "../utils/extends.js";

export const getAll = async (req, res) => {
  try {
    const activity = await Activity.find();
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getInfoDashboard = async (req, res) => {
  try {
    const tutor = req.params.tutor;
    const topFive = await getTop5(tutor);
    const totalTutorados = await getTotalTutorados(tutor);
    const totalCategorias = await getTotalCategoriasRegistradas(tutor);
    const totalActividades = await getTotalActividadesRegistradas(tutor);
    const dataGrafico = await getActividadesPorTutorado(tutor);

    res.json({
      dataGrafico,
      totalCategorias,
      topFive,
      totalTutorados,
      totalActividades,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (activity) {
      res.json(activity);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
