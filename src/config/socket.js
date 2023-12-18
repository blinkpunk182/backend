import { Server as SocketServer } from "socket.io";
const ubicacionesUsuarios = {}; // Objeto para almacenar ubicaciones por ID de usuario

const setupSocket = (server) => {
  const io = new SocketServer(server, {
    cors: { origin: "*" },
  });
  // Manejar la conexión de sockets
  io.on("connection", (socket) => {
    // Escuchar eventos de ubicación
    socket.on("ubicacion", ({ ubicacion, idTutorado }) => {
      if (idTutorado !== undefined) {
        ubicacionesUsuarios[idTutorado] = ubicacion;
        io.emit("ubicacion", ubicacionesUsuarios);
      }
    });

    socket.on("notificacion", (data) => {
      io.emit("notificacion", data);
    });

    socket.on("actualizarPerimetro", (data) => {
      io.emit("actualizarPerimetro", data);
    });

    socket.on("realTime", (data) => {
      io.emit("realTime", data);
    });

    socket.on("vibracion", (data) => {
      io.emit("vibracion", data);
    });

    // Manejar desconexiones
    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};

export default setupSocket;
