import { useState } from "react";
import UserList from "./UserList";
import Chat from "./Chat";
import PrivateRoute from "../../shared/components/PrivateRoute";

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <PrivateRoute>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#07b6ce",
        }}
      >
        <div
          style={{
            width: 300,
            background: "#fff",
            borderRight: "1px solid #eee",
            overflowY: "auto",
          }}
        >
          <UserList
            onSelect={setSelectedUserId}
            selectedUserId={selectedUserId}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedUserId ? (
            <Chat userId={selectedUserId} />
          ) : (
            <div style={{ color: "#888" }}>
              Selecciona un usuario para chatear
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}