import { Router } from 'express';
import chatRoutes from './chat.routes.js';

const router = Router();

// Usar las rutas de chat bajo /chat
router.use('/chat', chatRoutes);

export default router;