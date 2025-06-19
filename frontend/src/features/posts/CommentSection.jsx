import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1/post/comments';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/${postId}`)
      .then(res => res.json())
      .then(setComments);
  }, [postId]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments([...comments, newComment]);
      setContent('');
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h4>Comentarios</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escribe un comentario..."
          required
          style={{ flex: 1, borderRadius: 8, padding: 6 }}
        />
        <button type="submit">Comentar</button>
      </form>
      <ul style={{ marginTop: 8, paddingLeft: 0 }}>
        {comments.map(c => (
          <li key={c._id} style={{ listStyle: 'none', marginBottom: 4 }}>
            <strong>{c.author?.username || 'Usuario'}:</strong> {c.content}
          </li>
        ))}
      </ul>
    </div>
  );
}