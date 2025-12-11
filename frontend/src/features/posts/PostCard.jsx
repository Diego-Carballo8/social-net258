// Post.jsx
import React, { useState } from 'react';
import styles from './style.module.css';
import CommentSection from './CommentSection';

const PostCard = ({ post, onDelete }) => {
  const userId = localStorage.getItem('userId');
  const [postData, setPostData] = useState(post);
  const [liking, setLiking] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/v1/post/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar la publicación');
      }
      if (onDelete) onDelete(post._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLike = async () => {
    setLiking(true);
    try {
      const token = localStorage.getItem('token');
      const isLiked = postData.likes?.includes(userId);
      const endpoint = isLiked ? 'unlike' : 'like';
      
      const res = await fetch(`http://localhost:3000/api/v1/post/${post._id}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al actualizar like');
      
      const updatedPost = await res.json();
      setPostData(updatedPost);
    } catch (err) {
      console.error(err.message);
    }
    setLiking(false);
  };

  const isLiked = postData.likes?.includes(userId);

  return (
  <article className={styles.post}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img
        src={post.userImg || "https://randomuser.me/api/portraits/men/32.jpg"}
        alt={post.author?.username || post.author || "Usuario"}
        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
      />
      <div>
        <strong>{post.author?.username || post.author || "Usuario"}</strong>
        <div style={{ fontSize: 12, color: '#888' }}>
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
        </div>
      </div>
    </header>
    
    {/* Mostrar imagen si existe */}
    {post.image && (
      <img 
        src={`http://localhost:3000${post.image}`} 
        alt="Post"
        style={{ width: '100%', borderRadius: 8, marginTop: 12, maxHeight: 400, objectFit: 'cover' }}
      />
    )}
    
    <div style={{ margin: '12px 0' }}>
      {post.content}
    </div>
    <footer style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <button 
        onClick={handleLike}
        disabled={liking}
        className={styles.actionBtn}
        style={{ 
          color: isLiked ? '#e74c3c' : '#888',
          opacity: liking ? 0.6 : 1
        }}
        title={isLiked ? 'Quitar like' : 'Dar like'}
      >
        {isLiked ? '❤️' : '🤍'} {postData.likes?.length ?? 0}
      </button>
      {/* Delete button only for author */}
      {(post.author?._id === userId || post.author === userId) && (
        <button onClick={handleDelete} className={styles.actionBtn} style={{ color: '#ff5c5c' }}>
          🗑 Eliminar
        </button>
      )}
    </footer>
    {/* Aquí pasas el postId correctamente */}
    <CommentSection postId={post._id} />
  </article>
  );
};

export default PostCard;