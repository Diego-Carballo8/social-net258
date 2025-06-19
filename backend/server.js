import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDB from './config/db.js';
import { authRoutes } from './features/auth/index.js';
import authMiddleware from './shared/middlewares/auth.middleware.js';
import errorMiddleware from './shared/middlewares/error.middleware.js';
import postRoutes from './features/posts/index.js';
import chatRoutes from './features/chat/chat.routes.js';
import userRoutes from "./features/users/user.routes.js";
import topicRoutes from './features/topics/index.js';
import jwt from 'jsonwebtoken';

dotenv.config(); // Cargamos las variables de entorno

const app = express();
const server = http.createServer(app); // Cambia esto

// Middlewares globales
app.use(cors());
app.use(express.json());

connectDB();

// Ruta pública 
app.use('/api/v1/auth', authRoutes); // <--- Cambia 'users' por 'auth'

// Ruta de la publicación 
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use("/api/v1/users", userRoutes);
app.use('/api/v1/topics', topicRoutes);

// Rutas protegidas (requiere autenticación "login")
app.get('/api/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'acceso permitido', user: req.user });
});

// Middleware de manejo de errores (si algo falla en cualquier ruta)
app.use(errorMiddleware);

// --- SOCKET.IO ---
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173", // O el puerto de tu frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
});

// Cambia app.listen por server.listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});
