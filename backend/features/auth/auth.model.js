import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Por favor ingrese un correo válido'] },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String }, // <-- Agrega esta línea
  createdAt: { type: Date, default: Date.now }
});

// Middleware para hacer hash del password antes de guardar
userSchema.pre('save', async function (next) {
  // Si el password no ha sido modificado, no lo hasheamos
  if (!this.isModified('password')) return next();

  // Hashear el password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para validar el password
userSchema.methods.isPasswordValid = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Exportar el modelo
const User = mongoose.model('User', userSchema);
export default User;