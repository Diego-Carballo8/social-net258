import Message from './chat.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;
    const message = new Message({ from, to, text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el mensaje', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { from: userId1, to: userId2 },
        { from: userId2, to: userId1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mensajes', error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Mensaje no encontrado' });

    const requesterId = req.user?.userId || req.user?._id;
    if (!requesterId || msg.from.toString() !== requesterId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este mensaje' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mensaje eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar mensaje', error: error.message });
  }
};