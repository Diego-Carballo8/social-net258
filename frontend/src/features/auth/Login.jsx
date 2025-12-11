import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) navigate('/home');
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        navigate('/home');
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className={styles.page}>

        <div className={`${styles.modalDark}`}>
          <h2 className={styles.brandDark}><i className="fas fa-bolt"></i> Snappy</h2>
          <p className={styles.subtitle}>Ingresa a tu cuenta y conecta con tu comunidad</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="email">Correo o usuario</label>
              <input id="email" type="email" name="email" placeholder="tu@correo.com" value={formData.email} onChange={handleChange} required className={styles.input} disabled={loading} />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required className={styles.input} disabled={loading} />
            </div>

            <div className={styles.metaRow}><a href="#" className={styles.forgot}>¿Olvidaste tu contraseña?</a></div>

            <button type="submit" className={styles.primaryBtn} disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</button>
          </form>

          <p className={styles.formMeta}>¿No tienes una cuenta? <Link to="/register" className={styles.registerLink}>Regístrate aquí</Link></p>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>

      <footer className="footer"><div className="footer-content"><p>&copy; 2025 Snappy - Comparte, conecta, descubre</p></div></footer>
    </>
  );
};

export default Login;