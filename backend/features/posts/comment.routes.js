import express from 'express';
import * as commentController from './comment.controller.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

// Crear comentario
router.post('/:postId', authMiddleware, commentController.createComment);
// Obtener comentarios de un post
router.get('/:postId', commentController.getComments);

export default router;