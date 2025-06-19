import Post from './post.model.js';

// Crear una nueva publicación
export const createPost = async (req, res) => {
  console.log('Entrando a createPost',req.body, req.user); // Log para verificar que se está llamando a la funció
  try {
    const { content } = req.body;
  //  const author = req.user._id; // Asegúrate de tener autenticación
    const author = req.user.userId;
    const post = new Post({ content, author });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las publicaciones
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una publicación por ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una publicación
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json({ message: 'Publicación eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dar like a una publicación
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

    // Evitar likes duplicados
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ error: 'Ya diste like a esta publicación' });
    }

    post.likes.push(req.user._id);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Quitar like a una publicación
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

    post.likes = post.likes.filter(
      userId => userId.toString() !== req.user._id.toString()
    );
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};