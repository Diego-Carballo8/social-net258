import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        navigate('/');
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="main-container">
        {/* Contenedor de imágenes */}
        <div className="image-container">
          <div className="image-stack">
            <img
              src="https://i.postimg.cc/CLFsssVG/1000062516.jpg"
              alt="Imagen 1"
            />
            <img
              src="https://i.postimg.cc/ryfhDPB6/depositphotos-557351356-stock-photo-young-group-of-people-laughing.jpg"
              alt="Imagen 2"
            />
          </div>
        </div>

        {/* Contenedor de login */}
        <div className="login-container">
          <h2>Snappy</h2>
          <p>Ingresa tu cuenta</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Teléfono, usuario o correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input type="submit" value="Iniciar sesión" className="btn" />
          </form>

          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>

          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={{ color: '#0095f6' }}>
              Regístrate
            </Link>
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Todos los derechos reservados | TuNombre o Empresa</p>
        </div>
      </footer>
    </>
  );
};

export default Login;