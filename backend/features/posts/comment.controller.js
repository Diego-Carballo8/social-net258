import Comment from './comment.model.js';

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = req.params.postId;
    const author = req.user.userId;
    const comment = await Comment.create({ post, author, content });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const post = req.params.postId;
    const comments = await Comment.find({ post }).populate('author', 'username').sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};