// Post.jsx
import React from 'react';
import styles from './style.module.css';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => (
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
    <div style={{ margin: '12px 0' }}>
      {post.content}
    </div>
    <footer style={{ display: 'flex', gap: 16 }}>
      <button className={styles.actionBtn}><i className="far fa-heart"></i> {post.likes?.length ?? 0}</button>
      {/* Puedes agregar más acciones aquí */}
    </footer>
    {/* Aquí pasas el postId correctamente */}
    <CommentSection postId={post._id} />
  </article>
);

export default PostCard;