import express from 'express';
import multer from 'multer';
import * as authController from './auth.controller.js';

const router = express.Router();

// Configuración de multer para almacenar avatars
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/avatars');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = file.originalname.split('.').pop();
		cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
	}
});
const upload = multer({ storage });

// Ruta para registrar un usuario (acepta avatar)
router.post('/register', upload.single('avatar'), authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para obtener todos los usuarios
router.get('/users', authController.getUsers);

// Ruta para obtener un usuario por ID
router.get('/users/:id', authController.getUserById);

export default router;