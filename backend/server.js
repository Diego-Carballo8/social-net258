import express from 'express';
import fs from 'fs';
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

// Servir archivos subidos (avatars, posts)
const uploadsDir = 'uploads';
const avatarsDir = `${uploadsDir}/avatars`;
const postsDir = `${uploadsDir}/posts`;
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Almacenar usuarios conectados
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Nuevo cliente conectado:", socket.id);

  // Registrar usuario conectado
  socket.on("joinChat", ({ userId1, userId2 }) => {
    const roomId = [userId1, userId2].sort().join("_");
    socket.join(roomId);
    connectedUsers.set(socket.id, { userId: userId1, roomId });
    console.log(`📱 ${userId1} se unió a la sala: ${roomId}`);
  });

  // Escuchar mensajes
  socket.on("sendMessage", async (data) => {
    try {
      const roomId = [data.from, data.to].sort().join("_");
      // Guardar en DB es responsabilidad del frontend + API
      io.to(roomId).emit("newMessage", {
        from: data.from,
        to: data.to,
        text: data.text,
        createdAt: new Date(),
      });
      console.log(`💬 Mensaje: ${data.from} → ${data.to}`);
    } catch (error) {
      console.error("Error emitiendo mensaje:", error);
    }
  });

  // Escuchar "escribiendo"
  socket.on("typing", (data) => {
    const roomId = [data.userId, data.to].sort().join("_");
    io.to(roomId).emit("userTyping", {
      userId: data.userId,
      to: data.to,
      username: data.username,
    });
  });

  // Desconexión
  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      console.log(`❌ ${user.userId} desconectado`);
    }
  });
});

// Cambia app.listen por server.listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});
