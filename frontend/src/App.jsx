import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import PublicProfile from './features/profile/PublicProfile';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Ruta principal: redirigir a /login por defecto. Home queda en /home */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ruta protegida Home */}
          <Route
            path="/home"
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

          {/* Ruta para ver perfil público de otros usuarios */}
          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <PublicProfile />
              </PrivateRoute>
            }
          />

          {/* Redirigir a /login si no se encuentra la ruta */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        {/* Footer: ocultar en páginas públicas (login/register) */}
        <FooterWrapper />
      </div>
    </Router>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const publicPaths = ['/login', '/register'];
  if (publicPaths.includes(location.pathname)) return null;
  return <Footer />;
}

export default App;