import Post from './post.model.js';

// Crear una nueva publicación
export const createPost = async (req, res) => {
  console.log('Entrando a createPost', req.body, req.user);
  try {
    const { content } = req.body;
    const author = req.user.userId;
    const image = req.file ? `/uploads/posts/${req.file.filename}` : undefined;
    
    const post = new Post({ content, author, image });
    await post.save();
    
    // Popular el autor antes de devolver
    await post.populate('author', 'username');
    
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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

    // Verificar que el usuario sea el autor
    const requesterId = req.user?.userId || req.user?._id;
    const authorId = post.author?.toString();
    if (!requesterId || requesterId.toString() !== authorId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' });
    }

    // Si la publicación tiene imagen, intentar eliminar el archivo del disco
    if (post.image) {
      try {
        const fs = await import('fs');
        const path = post.image.startsWith('/') ? post.image.slice(1) : post.image; // quitar leading /
        if (fs.existsSync(path)) fs.unlinkSync(path);
      } catch (err) {
        // no bloquear la eliminación por errores en el borrado del archivo
        console.warn('No se pudo borrar imagen del post:', err.message);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
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

// Obtener posts de un usuario específico
export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};