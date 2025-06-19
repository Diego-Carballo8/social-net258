import React, { useState } from 'react';
import styles from './style.module.css';

const API_BASE_URL = 'http://localhost:3000/api/v1/post';

const CreatePost = ({ onCreate }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error('Error al crear la publicación');
      const newPost = await res.json();

      if (onCreate) onCreate(newPost);
      setContent('');
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.home}>
      <h2>Crear nueva publicación</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
          rows={3}
          style={{ width: '100%', borderRadius: 8, padding: 8 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;