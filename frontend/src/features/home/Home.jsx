import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './style.module.css';
import PostList from '../posts/PostList';
import PostFeed from '../posts/PostFeed';
import UserSearch from '../users/UserSearch';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState(null);
  const topicsContainerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(`${API_BASE_URL}/post`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const postsData = await response.json();
        setPosts(postsData);
      } catch (error) {
        setPosts([]);
      }
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function loadTopics() {
      try {
        const response = await fetch(`${API_BASE_URL}/topics`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const topicsData = await response.json();
        setTopics(topicsData);
      } catch (error) {
        setTopics([]);
      }
    }
    loadTopics();
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) return;
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log('Error loading user:', error);
      }
    }
    loadUser();
  }, []);

  const handleTopicsScroll = () => {
    if (topicsContainerRef.current) {
      topicsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // remove any other auth-related keys if present
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userId = localStorage.getItem('userId'); // Obtén tu propio ID

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <UserSearch />
        <div className={styles.headerIcons}>
          <i className={`fas fa-bell ${styles.icon}`}></i>
        </div>
      </header>

      <section className={styles.welcomeSection}>
        <h1>¡Bienvenido a Snappy!</h1>
        <p>Comparte momentos, descubre temas y conecta con tu comunidad.</p>
      </section>

      <section className={styles.topicsSection}>
        <div className={styles.topicsHeader}>
          <h2 className={styles.sectionTitle}>Temas populares</h2>
          <button className={styles.createTopicBtn} onClick={() => navigate('/publicar')}>
            <i className="fas fa-plus"></i> Crear Publicación
          </button>
        </div>
        <div className={styles.topicsContainer} ref={topicsContainerRef}>
          {topics.length === 0 && (
            <div className={styles.topicCard}>Sin temas</div>
          )}
          {topics.map(topic => (
            <div className={styles.topicCard} key={topic._id || topic.name}>
              #{topic.name}
            </div>
          ))}
        </div>
        <div className={styles.topicsNavigation} onClick={handleTopicsScroll}>
          <i className="fas fa-arrow-right"></i>
        </div>
      </section>

      <section className={styles.feedSection}>
        <PostFeed
          posts={posts}
          onPostCreated={post => setPosts([post, ...posts])}
          onPostDeleted={id => setPosts(posts.filter(p => p._id !== id && p.id !== id))}
        />
        {/* Títulos debajo del formulario */}
        <h2 className={styles.sectionTitle}>Publicaciones recientes</h2>
        {posts.length === 0 && (
          <div className={styles.emptyFeed}>No hay publicaciones aún.</div>
        )}
      </section>
    </div>
  );
};

export default Home;