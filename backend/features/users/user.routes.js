import express from "express";
import User from "./user.model.js";
import authMiddleware from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "_id username");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id username email createdAt");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

// Actualizar avatar del usuario
router.put('/:id/avatar', authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar },
      { new: true, select: '_id username email avatar createdAt' }
    );
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar avatar' });
  }
});

export default router;