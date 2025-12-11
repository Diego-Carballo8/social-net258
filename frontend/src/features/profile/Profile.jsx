import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';

const API_BASE_URL = 'http://localhost:3000/api/v1/users';

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><rect width='24' height='24' rx='4' fill='%23f3f4f6'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%23e6eaf0'/><path d='M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4' fill='%23e6eaf0'/></svg>`;

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

function isDirectImageUrl(url) {
  if (!url) return false;
  // data URIs or direct image files
  if (url.startsWith('data:')) return true;
  if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)) return true;
  // i.imgur.com is direct image host
  if (/i\.imgur\.com/.test(url)) return true;
  return false;
}

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsCount, setPostsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    const payload = decodeToken(token);
    if (!payload?.userId) return setLoading(false);

    fetch(`${API_BASE_URL}/${payload.userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUser(data); setBioText(data.bio || ''); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Cargar estadísticas (posts y likes) cuando el usuario esté disponible
  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/post/user/${user._id}`);
        if (!res.ok) return;
        const posts = await res.json();
        setPostsCount(posts.length || 0);
        const likes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
        setLikesCount(likes);
      } catch (err) {
        console.error('Error fetching user posts for stats', err);
      }
    })();
  }, [user]);

  // Edición de avatar deshabilitada por petición del usuario.

  const handleBioSave = async () => {
    if (!user) return;
    setSavingBio(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bio: bioText })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setBioText(data.bio || ''); // Asegurar que bioText se actualiza con el valor guardado
        setEditingBio(false);
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        alert('Error al guardar bio: ' + (errorData.message || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error saving bio:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) return <div className={styles.center}>Cargando perfil...</div>;
  if (!user) return <div className={styles.center}>No se pudo cargar el usuario.</div>;

  const avatarSrc = isDirectImageUrl(user?.avatar) ? normalizeImgurUrl(user.avatar) : DEFAULT_AVATAR;

  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        <div className={styles.card}>
          <img className={styles.avatar} src={avatarSrc} alt="avatar" />

          <div className={styles.info}>
            <h2 className={styles.username}>{user.username}</h2>
            <div className={styles.email}>{user.email}</div>
            <div className={styles.meta}>Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}</div>

            {editingBio ? (
              <div className={styles.bioEditContainer}>
                <textarea
                  className={styles.bioInput}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value.slice(0, 160))}
                  placeholder="Cuéntanos sobre ti (máx 160 caracteres)"
                  maxLength="160"
                />
                <div className={styles.bioActions}>
                  <button className={styles.bioBtn} onClick={handleBioSave} disabled={savingBio}>
                    {savingBio ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button className={styles.bioCancelBtn} onClick={() => { setEditingBio(false); setBioText(user.bio || ''); }}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.bioDisplay}>
                <p className={styles.bioText}>{user.bio && user.bio.trim() ? user.bio : <span className={styles.bioPlaceholder}>Sin biografía. Haz clic para añadir una</span>}</p>
                <button className={styles.bioEditBtn} onClick={() => setEditingBio(true)}>Editar</button>
              </div>
            )}

            <div className={styles.stats}>
              <div className={styles.statItem}><div className={styles.statNumber}>{postsCount}</div><div className={styles.statLabel}>Publicaciones</div></div>
              <div className={styles.statItem}><div className={styles.statNumber}>{likesCount}</div><div className={styles.statLabel}>Likes</div></div>
            </div>
          </div>

          {/* Edición de avatar deshabilitada */}
        </div>
      </div>
    </div>
  );
}