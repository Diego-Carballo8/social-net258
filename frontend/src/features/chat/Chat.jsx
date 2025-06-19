// src/features/chat/Chat.jsx
import { useEffect, useState, useRef } from "react";

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const myId = localStorage.getItem('userId');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadMessages() {
      if (!userId) return;
      const res = await fetch(`http://localhost:3000/api/v1/chat/messages/${myId}/${userId}`);
      const data = await res.json();
      setMessages(data);
    }
    loadMessages();
  }, [userId, myId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
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
    // Recarga los mensajes después de enviar
    const res = await fetch(`http://localhost:3000/api/v1/chat/messages/${myId}/${userId}`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      maxWidth: 320,
      margin: "24px auto",
      boxShadow: "0 4px 24px #0002",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      height: 500
    }}>
      <div style={{
        background: "#1976d2",
        color: "#fff",
        padding: "10px 16px",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        fontWeight: "bold",
        fontSize: 16
      }}>
        Chatea con tus amigos!
      </div>
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.from === myId ? "flex-end" : "flex-start"
            }}
          >
            <div style={{
              background: msg.from === myId ? "#1976d2" : "#f1f0f0",
              color: msg.from === myId ? "#fff" : "#222",
              borderRadius: 16,
              padding: "8px 16px",
              maxWidth: "70%",
              fontSize: 15,
              marginBottom: 2,
              wordBreak: "break-word",
              boxShadow: msg.from === myId
                ? "0 2px 8px #1976d233"
                : "0 2px 8px #aaa2"
            }}>
              {msg.text}
            </div>
            <div style={{
              fontSize: 11,
              color: "#888",
              marginBottom: 4,
              marginRight: msg.from === myId ? 4 : 0,
              marginLeft: msg.from === myId ? 0 : 4
            }}>
              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 8,
          borderTop: "1px solid #eee",
          display: "flex",
          gap: 6,
          background: "#fff"
        }}
      >
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{
            flex: 1,
            borderRadius: 8,
            border: "1px solid #b0e0e6",
            padding: "8px 10px",
            fontSize: 15,
            outline: "none"
          }}
        />
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
