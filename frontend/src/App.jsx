import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Home from './features/home/Home';
import PrivateRoute from './shared/components/PrivateRoute';
import ChatPage from "./features/chat/ChatPage";
import UserList from "./features/chat/UserList";
import CreatePost from './features/posts/CreatePost';
import PostFeed from './features/posts/PostFeed';
import Footer from './components/Footer';
import Profile from './features/profile/Profile';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Ruta protegida Home */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Ruta protegida Chat */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          <Route path="/usuarios" element={<UserList />} />

          {/* Ruta protegida para crear publicación */}
          <Route
            path="/publicar"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          {/* Ruta protegida para el perfil */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Redirigir a /login si no se encuentra la ruta */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        {/* Footer siempre visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;