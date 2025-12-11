import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../shared/hooks/useAuth';

const footerStyle = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  height: '56px',
  background: '#0099ff',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  zIndex: 1000,
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  flex: 1,
  textAlign: 'center',
};

export default function Footer() {
  const isAuthenticated = useAuth();

  // No mostrar el footer si el usuario no está autenticado
  if (!isAuthenticated) return null;

  return (
    <footer style={footerStyle}>
      <Link to="/home" style={linkStyle}>Inicio</Link>
      <Link to="/publicar" style={linkStyle}>Publicar</Link>
      <Link to="/chat" style={linkStyle}>Chat</Link>
      <Link to="/profile" style={linkStyle}>Perfil</Link>
    </footer>
  );
}