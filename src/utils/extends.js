import mongoose from "mongoose";
import Activity from "../models/activityModel.js";
import Tutorado from "../models/tutoradoModel.js";
import { colores } from "./constants.js";
import moment from "moment";
export const getTop5 = async (tutor) => {
  try {
    const topTutorados = await Activity.find().populate("tutorado");
    const resultData = topTutorados?.filter(
      (t) => t.tutorado?.tutor.toString() === tutor
    );

    const groupedData = resultData.reduce((acc, item) => {
      const tutorado = item.tutorado;

      if (!acc[tutorado]) {
        acc[tutorado] = [];
      }

      acc[tutorado].push(item);

      return acc;
    }, {});

    // Ordenar los tutorados por la cantidad de actividades en orden descendente
    const sortedTutorados = Object.keys(groupedData).sort((a, b) => {
      return groupedData[b].length - groupedData[a].length;
    });

    // Tomar solo los 5 primeros tutorados
    const result = sortedTutorados.slice(0, 5).map((key) => ({
      id_tutorado: groupedData[key][0]["tutorado"]["_id"],
      tutorado: `${groupedData[key][0]["tutorado"]["nombre"]} ${groupedData[key][0]["tutorado"]["apellido"]}`,
      total_actividades: groupedData[key].length,
      actividades: groupedData[key],
    }));

    return result;
  } catch (err) {
    return err;
  }
};

export const getTotalTutorados = async (tutor) => {
  try {
    const result = await Tutorado.find({ tutor, estado: "Activo" }).count();

    return result;
  } catch (err) {
    return err;
  }
};

export const getTotalCategoriasRegistradas = async (tutor) => {
  try {
    const activities = await Activity.aggregate([
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
          "tutorado.tutor": mongoose.Types.ObjectId(tutor),
        },
      },
    ]).exec();

    const categoriasUnicas = new Set();

    activities.forEach((activity) => {
      categoriasUnicas.add(activity.categoria);
    });

    const cantidadCategoriasUnicas = categoriasUnicas.size;

    return cantidadCategoriasUnicas;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getTotalActividadesRegistradas = async (tutor) => {
  try {
    const activities = await Activity.aggregate([
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
          "tutorado.tutor": mongoose.Types.ObjectId(tutor),
        },
      },
    ]).exec();

    return activities.length;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getActividadesPorTutorado = async (tutor) => {
  try {
    const topTutorados = await Activity.find().populate("tutorado");
    const resultData = topTutorados?.filter(
      (t) => t.tutorado?.tutor.toString() === tutor
    );

    // Utilizamos reduce para agrupar y contar
    const agrupado = resultData.reduce((resultado, elemento) => {
      const id = elemento.tutorado._id;
      if (!resultado[id]) {
        resultado[id] = {
          _id: id,
          nombre: `${elemento["tutorado"]["nombre"]} ${elemento["tutorado"]["apellido"]}`,
          actividades: 0,
        };
      }
      resultado[id].actividades++;
      return resultado;
    }, {});

    // Convertir el objeto agrupado en una lista de resultados
    const resultado = Object.values(agrupado);

    const totalActividades = resultado.reduce(
      (total, usuario) => total + usuario.actividades,
      0
    );

    // Utilizamos reduce para construir los arreglos
    const { tutorados, actividades, colors } = resultado.reduce(
      (result, item) => {
        result.tutorados.push(item.nombre);
        result.actividades.push(
          parseFloat(((item.actividades / totalActividades) * 100).toFixed(2))
        );
        result.colors.push(getColor());
        return result;
      },
      { tutorados: [], actividades: [], colors: [] }
    );

    // Creamos el objeto final
    const resultadoFinal = { tutorados, actividades, colors };

    return resultadoFinal;
  } catch (err) {
    return err;
  }
};

const getColor = () => {
  const claves = Object.keys(colores);

  // Genera un índice aleatorio
  const indiceAleatorio = Math.floor(Math.random() * claves.length);

  // Obtiene la clave aleatoria utilizando el índice
  const color = claves[indiceAleatorio];
  return color;
};

export const haPasadoUnDia = (fechaDada) => {
  // Comprobar si la fecha dada es válida
  if (!moment(fechaDada).isValid()) {
    throw new Error("Fecha no válida");
  }

  // Obtener la fecha actual
  const hoy = moment();

  // Obtener la fecha dada
  const fecha = moment(fechaDada);

  // Comparar si ha pasado un día
  const haPasado = hoy.diff(fecha, "days") > 0;

  return haPasado;
};
