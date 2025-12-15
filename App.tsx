
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/auth"
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
        />
         <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
