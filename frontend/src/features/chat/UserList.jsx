import { useEffect, useState } from "react";

export default function UserList({ onSelect, selectedUserId }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function cargarUsuarios() {
      const res = await fetch("http://localhost:3000/api/v1/users");
      const data = await res.json();
      setUsuarios(data);
    }
    cargarUsuarios();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Usuarios</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {usuarios.map(u => (
          <li key={u._id} style={{ marginBottom: 8 }}>
            <button
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: selectedUserId === u._id ? "2px solid #1976d2" : "1px solid #1976d2",
                background: selectedUserId === u._id ? "#e3f2fd" : "#fff",
                color: "#1976d2",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => onSelect(u._id)}
            >
              {u.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}