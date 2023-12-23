import Activity from "../models/activityModel.js";
import Tutorado from "../models/tutoradoModel.js";
import { haPasadoUnDia } from "../utils/extends.js";
export const getByTuthor = async (req, res) => {
  const tutor = req.params.tutor;
  try {
    const tutorado = await Tutorado.find({ tutor, estado: "Activo" });
    res.json(tutorado);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const getById = async (req, res) => {
  try {
    const tutorado = await Tutorado.findById(req.params.id);
    const actividades = await Activity.find({
      tutorado: req.params.id,
    });

    const transformData = actividades?.map((actividad) => {
      const opcionesFecha = {
        // weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      return {
        _id: actividad._id,
        nombre: actividad.nombre,
        categoria: actividad.categoria,
        fechaInicio: actividad.fechaInicio.toLocaleDateString(
          "es-ES",
          opcionesFecha
        ),
        fechaFin: actividad.fechaFin.toLocaleDateString("es-ES", opcionesFecha),
      };
    });

    if (tutorado) {
      res.json({
        tutorado,
        actividades: transformData,
        totalActividades: actividades.length,
      });
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
    const { cedula, apellido, telefono, codigoTutorado } = req.body;

    if (!cedula || !apellido || !telefono || !codigoTutorado) {
      return res
        .status(400)
        .json({ error: "Asegurese de llenar toda la información" });
    }
    req.body.codigoTutorado = `tutorado_${req.body.codigoTutorado}`;

    const existTutorado = await Tutorado.findOne({
      $or: [{ cedula }, { codigoTutorado: req.body.codigoTutorado }],
    });

    if (existTutorado) {
      if (existTutorado.cedula === cedula) {
        return res
          .status(400)
          .json({ error: "El tutorado ya se encuentra registrado" });
      } else {
        return res
          .status(400)
          .json({ error: "El código está siendo usado por otro tutorado" });
      }
    }
    req.body.estado = "Activo";
    const tutorado = new Tutorado(req.body);
    await tutorado.save();
    res.status(201).json(tutorado);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const update = async (req, res) => {
  try {
    const { cedula, apellido, telefono, codigoTutorado } = req.body;

    if (!cedula || !apellido || !telefono || !codigoTutorado) {
      return res
        .status(400)
        .json({ error: "Asegurese de llenar toda la información" });
    }
    const idTutorado = req.params.idTutorado;

    const tutorado = await Tutorado.findByIdAndUpdate(idTutorado, req.body, {
      new: true,
    });
    if (tutorado) {
      res.status(201).json(tutorado);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const activeAndDesactive = async (req, res) => {
  try {
    const idTutorado = req.params.idTutorado;

    const tutorado = await Tutorado.findById(idTutorado);
    if (tutorado?.estado === "Activo") {
      req.body.estado = "Inactivo";
    } else {
      req.body.estado = "Activo";
    }
    const tutoradoUpdated = await Tutorado.findByIdAndUpdate(
      idTutorado,
      req.body,
      {
        new: true,
      }
    );
    if (tutoradoUpdated) {
      res.status(201).json(tutoradoUpdated);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const createPerimetro = async (req, res) => {
  try {
    const { coords } = req.body;

    if (coords.length === 0) {
      return res
        .status(400)
        .json({ error: "Asegurese de llenar toda la información" });
    }
    const idTutorado = req.params.idTutorado;

    const tutorado = await Tutorado.findByIdAndUpdate(
      idTutorado,
      { perimetro: coords },
      {
        new: true,
      }
    );

    res.status(201).json(tutorado);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const deletePerimetro = async (req, res) => {
  try {
    const idTutorado = req.params.idTutorado;

    const tutoradoUpdated = await Tutorado.findByIdAndUpdate(
      idTutorado,
      { perimetro: [] },
      {
        new: true,
      }
    );
    if (tutoradoUpdated) {
      res.status(201).json(tutoradoUpdated);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const saveLocation = async (req, res) => {
  try {
    const { ubicacion } = req.body;
    if (!ubicacion) {
      return res
        .status(400)
        .json({ error: "Asegurese de llenar toda la información" });
    }
    const idTutorado = req.params.idTutorado;

    const tutorado = await Tutorado.findByIdAndUpdate(
      idTutorado,
      { ubicacion },
      {
        new: true,
      }
    );

    res.status(201).json(tutorado);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const sendEmail = async (req, res) => {
  try {
    const idTutorado = req.params.idTutorado;
    let envioEmail = true;

    const tutorado = await Tutorado.findById(idTutorado);
    if (tutorado?.fechaEnvioEmail) {
      envioEmail = haPasadoUnDia(tutorado?.fechaEnvioEmail);
      console.log(envioEmail);
    }

    res.status(200).json(envioEmail);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const saveDateEmail = async (req, res) => {
  try {
    const idTutorado = req.params.idTutorado;

    const tutorado = await Tutorado.findByIdAndUpdate(
      idTutorado,
      { fechaEnvioEmail: moment() },
      {
        new: true,
      }
    );

    res.status(201).json(tutorado);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
