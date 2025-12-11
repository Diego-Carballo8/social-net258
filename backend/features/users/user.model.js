import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: null },
  bio: { type: String, default: '', maxlength: 160 },
  createdAt: { type: Date, default: Date.now },
});

// Evita el error de sobreescritura:
export default mongoose.models.User || mongoose.model("User", userSchema);