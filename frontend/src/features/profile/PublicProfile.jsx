import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './publicProfile.module.css';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function normalizeImgurUrl(url) {
  if (!url) return url;
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return url;
  if (url.includes('imgur.com')) {
    if (url.includes('i.imgur.com')) return url;
    const match = url.match(/imgur\.com\/(?:a\/|gallery\/)?([a-zA-Z0-9]+)/);
    if (match && match[1]) return `https://i.imgur.com/${match[1]}.jpg`;
  }
  return url;
}

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const resUser = await fetch(`${API_BASE_URL}/users/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (resUser.ok) setUser(await resUser.json());
        const resPosts = await fetch(`${API_BASE_URL}/post/user/${userId}`);
        if (resPosts.ok) setUserPosts(await resPosts.json());
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <div className={styles.center}>Cargando perfil...</div>;
  if (!user) return <div className={styles.center}>Perfil no encontrado</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>

      <div className={styles.card}>
        <img className={styles.avatar} src={normalizeImgurUrl(user.avatar) || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={user.username} />
        <div className={styles.info}>
          <h2 className={styles.username}>{user.username}</h2>
          <div className={styles.email}>{user.email}</div>
          <div className={styles.meta}>Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}</div>
        </div>
      </div>

      <section className={styles.postsSection}>
        <h3 className={styles.postsTitle}>Publicaciones</h3>
        {userPosts.length === 0 ? (
          <div className={styles.emptyPosts}>Sin publicaciones aún</div>
        ) : (
          <div className={styles.postsList}>
            {userPosts.map(p => (
              <div key={p._id} className={styles.postPreview}>
                {p.image && <img src={`http://localhost:3000${p.image}`} alt="post" className={styles.postImage} />}
                <div className={styles.postContent}>{p.content}</div>
                <div className={styles.postMeta}>❤️ {p.likes?.length || 0} • {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
