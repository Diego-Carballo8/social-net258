import express from "express";
import User from "./user.model.js";
import authMiddleware from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

// Obtener todos los usuarios (incluye avatar)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "_id username avatar");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Buscar usuarios por nombre o email (DEBE ir ANTES de /:id)
router.get("/search/query", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.json([]);
    }
    
    const users = await User.find(
      {
        $or: [
          { username: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      },
      "_id username email avatar bio"
    ).limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar usuarios" });
  }
});

// Actualizar avatar del usuario (DEBE ir ANTES de PUT /:id)
router.put('/:id/avatar', authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar },
      { new: true, select: '_id username email avatar bio createdAt' }
    );
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar avatar' });
  }
});

// Actualizar perfil del usuario (bio, etc)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { bio } = req.body;
    console.log(`PUT /api/v1/users/${req.params.id} body:`, req.body, 'authenticated user:', req.user || null);
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, select: '_id username email avatar bio createdAt' }
    );
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

// Obtener usuario por ID (incluye avatar y bio) (DEBE ir AL FINAL)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id username email avatar bio createdAt");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

export default router;