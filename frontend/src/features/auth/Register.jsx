import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './login.module.css';

// Función para convertir URLs de Imgur a URLs directas
function normalizeImgurUrl(url) {
  if (!url) return url;
  // Si ya es una URL directa (termina en .jpg, .png, etc), devolver tal cual
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return url;
  }
  // Si es una URL de imgur.com, extraer ID y construir URL directa
  if (url.includes('imgur.com')) {
    // Detectar formatos:
    // - imgur.com/ID
    // - imgur.com/a/ALBUMID
    // - imgur.com/gallery/ID
    // - i.imgur.com/ID.jpg (ya es directa)
    
    // Si ya es i.imgur.com, devolverla tal cual
    if (url.includes('i.imgur.com')) {
      return url;
    }
    
    // Extraer el ID (último segmento de la URL, sin extensión)
    const match = url.match(/imgur\.com\/(?:a\/|gallery\/)?([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      const id = match[1];
      // Construir URL directa con .jpg
      return `https://i.imgur.com/${id}.jpg`;
    }
  }
  return url;
}

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', avatarUrl: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, avatarUrl: url });
    if (url) {
      setAvatarPreview(normalizeImgurUrl(url));
      setAvatarFile(null); // limpiar archivo si se pone URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('username', formData.username);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      
      // Si hay URL de Imgur normalizada, enviarla; si no, enviar archivo
      if (formData.avatarUrl) {
        const normalized = normalizeImgurUrl(formData.avatarUrl);
        payload.append('avatarUrl', normalized);
      } else if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.modalLight}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className={styles.brand} style={{ margin: 0 }}><i className="fas fa-bolt"></i> Snappy</h2>
            <Link to="/login" style={{ color: '#10212a', textDecoration: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>← Volver</Link>
          </div>
          <p className={styles.subtitle}>Crea una cuenta y únete a nuestra comunidad</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="username">Nombre de usuario</label>
              <input type="text" id="username" name="username" placeholder="tu_usuario" value={formData.username} onChange={handleChange} required className={styles.input} disabled={loading} />
            </div>

            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="tu@correo.com" value={formData.email} onChange={handleChange} required className={styles.input} disabled={loading} />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="Contraseña segura" value={formData.password} onChange={handleChange} required className={styles.input} disabled={loading} />
            </div>

            <div className={styles.fileInputWrapper}>
              <label htmlFor="avatar">Foto de perfil (opcional)</label>
              <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} className={styles.fileInput} disabled={loading} />
            </div>

            {avatarPreview && (<div style={{ textAlign: 'center', marginBottom: 8 }}><img src={avatarPreview} alt="preview" className={styles.avatarPreview} /></div>)}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
          </form>

          <p className={styles.formMeta}>¿Ya tienes una cuenta? <Link to="/login" className={styles.registerLink}>Inicia sesión</Link></p>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>

      <footer className="footer"><div className="footer-content"><p>&copy; 2025 Snappy - Comparte, conecta, descubre</p></div></footer>
    </>
  );
};

export default Register;