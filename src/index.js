import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import routerAuth from "./routes/authRoute.js";
import routerActivity from "./routes/activityRoutes.js";
import routerTutorado from "./routes/tutoradoRoutes.js";
import setupSocket from "./config/socket.js";
import routerNotification from "./routes/notificationRoute.js";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
export const server = http.createServer(app);

connectDB()
  .then(() => {
    app.use("/api/auth", routerAuth);
    app.use("/api/activity", routerActivity);
    app.use("/api/tutorado", routerTutorado);
    app.use("/api/notificacion", routerNotification);

    setupSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
