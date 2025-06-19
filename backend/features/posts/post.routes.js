import express from 'express';
const router = express.Router();
import * as postController from './post.controller.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import commentRoutes from './comment.routes.js';

// log para verificar que las rutas se están cargando
console.log('Cargando rutas de post');

// Crear publicación
router.post('/', authMiddleware, postController.createPost);

// Obtener todas las publicaciones
router.get('/', postController.getPosts);

// Obtener una publicación por ID
router.get('/:id', postController.getPostById);

// Eliminar una publicación
router.delete('/:id', authMiddleware, postController.deletePost);

// Dar like a una publicación
router.post('/:id/like', authMiddleware, postController.likePost);

// Quitar like a una publicación
router.post('/:id/unlike', authMiddleware, postController.unlikePost);

router.use('/comments', commentRoutes);

export default router;