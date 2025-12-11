import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './users.module.css';

const API_BASE_URL = 'http://localhost:3000/api/v1/users';
const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><rect width='24' height='24' rx='4' fill='%23f3f4f6'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%23e6eaf0'/><path d='M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4' fill='%23e6eaf0'/></svg>`;

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/search/query?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
    }
    setSearching(false);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Buscar usuarios..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        {searching && <span className={styles.spinner}>⏳</span>}
      </div>

      {searchResults.length > 0 && (
        <div className={styles.searchResults}>
          {searchResults.map(user => (
            <div
              key={user._id}
              className={styles.userResult}
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={user.avatar || DEFAULT_AVATAR}
                alt={user.username}
                className={styles.resultAvatar}
              />
              <div className={styles.resultInfo}>
                <div className={styles.resultUsername}>{user.username}</div>
                <div className={styles.resultEmail}>{user.email}</div>
                {user.bio && <div className={styles.resultBio}>{user.bio}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !searching && (
        <div className={styles.noResults}>
          No se encontraron usuarios para "{searchQuery}"
        </div>
      )}
    </div>
  );
}
