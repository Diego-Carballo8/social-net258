import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <i className="fas fa-bolt"></i>
          <span>Snappy</span>
        </div>
        <nav className={styles.nav}>
          <Link to="/home" className={styles.navItem}>
            <i className="fas fa-home"></i>
            <span>Inicio</span>
          </Link>
          <Link to="/publicar" className={styles.navItem}>
            <i className="fas fa-plus-circle"></i>
            <span>Publicar</span>
          </Link>
          <Link to={userId ? `/chat/${userId}` : "/chat"} className={styles.navItem}>
            <i className="fas fa-comments"></i>
            <span>Chat</span>
          </Link>
          <Link to="/profile" className={styles.navItem}>
            <i className="fas fa-user"></i>
            <span>Perfil</span>
          </Link>
        </nav>
        <div className={styles.profileArea}>
          <div className={styles.profileIcon}>
            <i className="fas fa-user-circle"></i>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;