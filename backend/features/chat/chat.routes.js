import express from 'express';
import * as chatController from './chat.controller.js';

const router = express.Router();

// Ruta para enviar un mensaje
router.post('/send', chatController.sendMessage);

// Ruta para obtener mensajes entre dos usuarios
router.get('/messages/:userId1/:userId2', chatController.getMessages);

export default router;