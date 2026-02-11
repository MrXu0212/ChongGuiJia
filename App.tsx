
import React from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import MessagePage from './pages/MessagePage';
import ProfilePage from './pages/ProfilePage';
import PetDetailPage from './pages/PetDetailPage';
import FormPage from './pages/FormPage';
import FavoritesPage from './pages/FavoritesPage';
import BottomNav from './components/BottomNav';

// 路由守卫：需要登录才能访问
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500">加载中...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const location = useLocation();

  // 定义哪些路径显示底部导航
  const showBottomNav = ['/discover', '/message', '/profile', '/favorites'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
        <Route path="/message" element={<ProtectedRoute><MessagePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/pet/:id" element={<ProtectedRoute><PetDetailPage /></ProtectedRoute>} />
        <Route path="/apply/:petId?" element={<ProtectedRoute><FormPage /></ProtectedRoute>} />
      </Routes>

      {showBottomNav && <BottomNav />}

      {/* iOS indicator bar placeholder */}
      <div className="bg-white dark:bg-zinc-950 h-8 flex justify-center items-start pt-2">
        <div className="w-32 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
