import User from './auth.model.js';
import jwt from 'jsonwebtoken';

// Controlador para registrar un usuario
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validar dominio del correo
    if (!email.endsWith('@cbtis258.edu.mx')) {
      return res.status(400).json({ message: 'Solo se permiten correos con un dominio especifico' });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({ username, email, password });

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: newUser._id, username, email },
      token,
      userId: newUser._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Controlador para iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordValid(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Controlador para obtener usuarios
export const getUsers = async (req, res) => {
  try {
    const { userId } = req.query; // o usa req.user si tienes auth
    const users = await User.find({ _id: { $ne: userId } }, 'username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};