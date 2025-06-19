import React from 'react';

const footerStyle = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  height: '56px',
  background: 'linear-gradient(90deg, #0099ff 40%, #ff7e5f 100%)',
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
  return (
    <footer style={footerStyle}>
      <a href="/" style={linkStyle}>Inicio</a>
      <a href="/publicar" style={linkStyle}>Publicar</a>
      <a href="/chat" style={linkStyle}>Chat</a>
      <a href="/profile" style={linkStyle}>Perfil</a>
    </footer>
  );
}