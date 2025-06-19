import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para obtener todos los usuarios
router.get('/users', authController.getUsers);

export default router;