import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated, logout } from "./api/auth";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import PostPage from "./pages/PostPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import SetupPage from "./pages/SetupPage";
import AdminPage from "./pages/AdminPage";

interface ProtectedProps {
  authed: boolean;
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ authed, children }) => {
  return authed ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App: React.FC = () => {
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());
  const [isAdminUser, setIsAdminUser] = useState<boolean>(isAdmin());

  const handleLogin  = () => {
    setAuthed(true);
    setIsAdminUser(isAdmin());
  };
  const handleLogout = () => {
    logout();
    setAuthed(false);
    setIsAdminUser(false);
  };

  return (
    <div className="app">
      <Navbar authed={authed} isAdmin={isAdminUser} onLogout={handleLogout} />
      <main className="main">
        <Routes>
          {/* Public routes */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/blog"       element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/about"      element={<AboutPage />} />

          {/* One-time setup — self-sealing after first use */}
          <Route path="/setup" element={<SetupPage />} />

          {/* Auth */}
          <Route
            path="/auth"
            element={
              authed
                ? isAdminUser
                  ? <Navigate to="/admin" replace />
                  : <Navigate to="/" replace />
                : <AuthPage onLogin={handleLogin} />
            }
          />
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          {/* Protected */}
          <Route
            path="/admin"
            element={
              <Protected authed={authed && isAdminUser}>
                <AdminPage onUnauthorized={handleLogout} />
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© Evans_Wanderlust · Built with TypeScript + React · No algorithms, just good writing.</p>
      </footer>
    </div>
  );
};

export default App;
