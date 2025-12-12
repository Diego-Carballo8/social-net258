import { useState } from "react";
import UserList from "./UserList";
import Chat from "./Chat";
import PrivateRoute from "../../shared/components/PrivateRoute";

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        background: "#fff",
      }}
    >
      {/* User List Sidebar */}
      <div
        style={{
          width: 280,
          background: "rgba(255, 255, 255, 0.9)",
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
          overflowX: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <UserList
          onSelect={setSelectedUserId}
          selectedUserId={selectedUserId}
        />
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        {selectedUserId ? (
          <Chat userId={selectedUserId} />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: "16px",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ fontSize: "48px" }}>💬</div>
            <p>Selecciona un usuario para comenzar a chatear</p>
          </div>
        )}
      </div>
    </div>
  );
}