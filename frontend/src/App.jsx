import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useStore, api, setClerkGetToken } from './store/useStore';

// Layout & global components
import Sidebar from './components/Sidebar';
import NotificationToast from './components/NotificationToast';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPages from './pages/AuthPages';
import UserDashboard from './pages/UserDashboard';
import VideoLibrary from './pages/VideoLibrary';
import VideoPlayer from './pages/VideoPlayer';
import AdminDashboard from './pages/AdminDashboard';
import VideoManagement from './pages/VideoManagement';
import ProfilePage from './pages/ProfilePage';
import CertificatesPage from './pages/CertificatesPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Admin Route Guard
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// Public Route Guard (Redirects away from Login/Register if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

// Clerk State Synchronization Manager
function ClerkSyncManager({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { setUser } = useStore();
  const [syncing, setSyncing] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setClerkGetToken(getToken);
  }, [getToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded || syncing) {
        setShowWarning(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [isLoaded, syncing]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setSyncing(false);
      return;
    }

    const syncUser = async () => {
      try {
        const res = await api.get('/auth/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to sync user with database:', err);
        setUser(null);
      } finally {
        setSyncing(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, clerkUser, setUser]);

  if (!isLoaded || syncing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center p-6 font-sans">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        {showWarning && (
          <div className="max-w-md bg-slate-900 border border-slate-800/80 p-5 rounded-xl text-xs text-slate-400 space-y-3 shadow-xl">
            <p className="font-bold text-sky-400 text-sm">Initialization taking longer than expected...</p>
            <p className="text-left leading-relaxed">This is usually caused by one of the following:</p>
            <ul className="list-disc pl-4 text-left space-y-1.5 text-slate-350">
              <li><strong>Clerk publishable key missing</strong>: Check if <code>VITE_CLERK_PUBLISHABLE_KEY</code> is set in your Vercel Environment Variables.</li>
              <li><strong>Backend server spin-up</strong>: Render free tier instances go to sleep when inactive and can take up to 50 seconds to warm up and respond.</li>
              <li><strong>CORS or Network Block</strong>: Press <strong>F12</strong> to open your Browser Developer Console and click the <strong>Console</strong> or <strong>Network</strong> tab to see any red error messages.</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return children;
}

// Inner wrapper to conditionally display Sidebar based on active route
function RouteWrapper() {
  const location = useLocation();
  const { initTheme } = useStore();
  
  // Initialize theme on app boot
  useEffect(() => {
    initTheme();
  }, []);

  const publicRoutes = ['/', '/login', '/register'];
  const showSidebar = !publicRoutes.includes(location.pathname);

  const getRouteElement = () => {
    return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><AuthPages isRegisterInitial={false} /></PublicRoute>} />

        <Route path="/register" element={<PublicRoute><AuthPages isRegisterInitial={true} /></PublicRoute>} />

        {/* Protected Learner Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><VideoLibrary /></ProtectedRoute>} />
        <Route path="/video/:id" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/videos" element={<AdminRoute><VideoManagement /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  if (showSidebar) {
    return <Sidebar>{getRouteElement()}</Sidebar>;
  }

  return getRouteElement();
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 dark:bg-slate-950 transition-colors duration-300">
        <ClerkSyncManager>
          <RouteWrapper />
        </ClerkSyncManager>
        
        {/* Global Floating Components */}
        <NotificationToast />
      </div>
    </Router>
  );
}
