// src/features/chat/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import styles from "./chat.module.css";

const SOCKET_SERVER = "http://localhost:3000";

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("Usuario");
  const [userAvatar, setUserAvatar] = useState("U");
  const [isTyping, setIsTyping] = useState(false);
  const myId = localStorage.getItem('userId');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Inicializar Socket.io
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Escuchar nuevos mensajes
    socketRef.current.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Escuchar cuando alguien está escribiendo
    socketRef.current.on("userTyping", (data) => {
      if (data.userId !== myId && data.to === myId) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    // Unirse a una sala de chat (pareja de usuarios)
    if (myId && userId) {
      socketRef.current.emit("joinChat", { userId1: myId, userId2: userId });
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketRef.current.off("newMessage");
      socketRef.current.off("userTyping");
    };
  }, [myId, userId]);

  // Cargar información del usuario
  useEffect(() => {
    async function loadUserInfo() {
      if (!userId) return;
      try {
        const userRes = await fetch(`http://localhost:3000/api/v1/auth/users/${userId}`);
        const user = await userRes.json();
        if (user) {
          setUserName(user.username || "Usuario");
          setUserAvatar(user.username?.charAt(0).toUpperCase() || "U");
        }
      } catch (err) {
        console.error("Error cargando info del usuario:", err);
      }
    }
    loadUserInfo();
  }, [userId]);

  // Cargar mensajes previos
  useEffect(() => {
    async function loadMessages() {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:3000/api/v1/chat/messages/${myId}/${userId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error cargando chat:", err);
      }
    }
    loadMessages();
  }, [userId, myId]);

  const handleTyping = () => {
    // Notificar que estoy escribiendo
    if (socketRef.current) {
      socketRef.current.emit("typing", {
        userId: myId,
        to: userId,
        username: userName,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // Emitir mensaje a través de Socket.io
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          from: myId,
          to: userId,
          text: message,
          timestamp: new Date(),
        });
      }

      // También guardar en base de datos
      await fetch('http://localhost:3000/api/v1/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: myId,
          to: userId,
          text: message,
        }),
      });

      setMessage("");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      {/* Header WhatsApp-style */}
      <div className={styles.chatHeader}>
        <div className={styles.headerUser}>
          <div className={styles.userAvatar}>
            {userAvatar}
          </div>
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{userName}</h3>
            <p className={styles.userStatus}>
              {isTyping ? "escribiendo..." : "En línea"}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionIcon}>📞</button>
          <button className={styles.actionIcon}>📹</button>
          <button className={styles.actionIcon}>⋮</button>
        </div>
      </div>

      {/* Messages Container */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Inicia la conversación con {userName}</p>
          </div>
          ) : (
          messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`${styles.messageWrapper} ${msg.from === myId ? styles.messageOwn : styles.messageOther}`}
            >
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{msg.text}</p>
                <span className={styles.messageTime}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
              </div>
              {/* Delete button for messages sent by me */}
              {msg.from === myId && (
                <button
                  onClick={async () => {
                    if (!confirm('¿Eliminar este mensaje?')) return;
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch(`http://localhost:3000/api/v1/chat/messages/${msg._id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.message || 'Error al eliminar mensaje');
                      }
                      setMessages(prev => prev.filter(m => (m._id || m.id) !== (msg._id || msg.id)));
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                  style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#ff5c5c', cursor: 'pointer' }}
                  title="Eliminar mensaje"
                >
                  🗑
                </button>
              )}
            </div>
          ))
        )}
        {isTyping && (
          <div className={styles.typingIndicator}>
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <button type="button" className={styles.attachButton}>📎</button>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          className={styles.chatInput}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={styles.sendButton}
        >
          ➤
        </button>
      </form>
    </div>
  );
}
