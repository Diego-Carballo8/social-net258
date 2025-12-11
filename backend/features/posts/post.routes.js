import express from 'express';
const router = express.Router();
import multer from 'multer';
import * as postController from './post.controller.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import commentRoutes from './comment.routes.js';

// Configuración de multer para imágenes de posts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});
const upload = multer({ storage });

// log para verificar que las rutas se están cargando
console.log('Cargando rutas de post');

// Crear publicación con soporte para imagen
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// Obtener todas las publicaciones
router.get('/', postController.getPosts);

// Obtener posts de un usuario específico
router.get('/user/:userId', postController.getPostsByUser);

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