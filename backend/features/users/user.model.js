import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // Puedes agregar más campos si quieres
});

// Evita el error de sobreescritura:
export default mongoose.models.User || mongoose.model("User", userSchema);