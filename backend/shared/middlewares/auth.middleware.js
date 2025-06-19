import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado' });
    }

    // Extraer el token
    const token = authHeader.replace('Bearer ', '');

    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar la información del usuario al objeto de la solicitud
    req.user = decoded;

    // Continuar con la siguiente función
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
  }
};

export default authMiddleware;