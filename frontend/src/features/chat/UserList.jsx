import { useEffect, useState } from "react";
import styles from "./UserList.module.css";

export default function UserList({ onSelect, selectedUserId }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/users");
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    }
    cargarUsuarios();
  }, []);

  return (
    <div className={styles.userListContainer}>
      <div className={styles.listHeader}>
        <h2 className={styles.title}>Mensajes</h2>
        <button className={styles.headerIcon} aria-label="Crear chat" title="Nuevo chat">⚡</button>
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Buscar usuario..."
          className={styles.searchInput}
          aria-label="Buscar usuarios"
        />
        <div style={{ position: 'absolute', left: 22, top: 18, pointerEvents: 'none', color: 'var(--muted)' }}>🔍</div>
      </div>

      <ul className={styles.userList}>
        {usuarios.map(u => (
          <li key={u._id} className={styles.userItem}>
            <button
              className={`${styles.userButton} ${selectedUserId === u._id ? styles.active : ""}`}
              onClick={() => onSelect(u._id)}
              aria-pressed={selectedUserId === u._id}
            >
              <div className={styles.userAvatar} aria-hidden>
                {u.username ? u.username.charAt(0).toUpperCase() : "U"}
              </div>
              <div className={styles.userDetails}>
                <h3 className={styles.username}>{u.username}</h3>
                <p className={styles.lastMessage}>En línea</p>
              </div>
              <div className={styles.userTime}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}