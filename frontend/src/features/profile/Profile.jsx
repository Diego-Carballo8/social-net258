import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1/users';

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = decodeToken(token);
    if (!payload?.userId) return;

    fetch(`${API_BASE_URL}/${payload.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/${user._id}/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });
      const data = await res.json();
      setUser(data);
      setAvatarUrl('');
    } catch {}
    setSaving(false);
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (!user) return <div>No se pudo cargar la información del usuario.</div>;

  return (
    <div style={{
      maxWidth: 400,
      margin: '40px auto',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px #0002',
      padding: 32,
      textAlign: 'center'
    }}>
      <img
        src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
        alt="Avatar"
        style={{ width: 90, height: 90, borderRadius: '50%', marginBottom: 16 }}
      />
      <form onSubmit={handleAvatarChange} style={{ marginBottom: 16 }}>
        <input
          type="url"
          placeholder="URL de tu nueva foto"
          value={avatarUrl}
          onChange={e => setAvatarUrl(e.target.value)}
          style={{ padding: 6, borderRadius: 8, width: '70%' }}
          required
        />
        <button type="submit" disabled={saving} style={{ marginLeft: 8 }}>
          {saving ? 'Guardando...' : 'Cambiar foto'}
        </button>
      </form>
      <h2 style={{ margin: 0 }}
      >{user.username}</h2>
      <p style={{ color: '#FFFF', margin: '8px 0' }}>{user.email}</p>
      <p><strong>Miembro desde:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}</p>
      {/* Puedes agregar más información aquí */}
    </div>
  );
}