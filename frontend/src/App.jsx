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
import BlogsPage from './pages/BlogsPage';
import ArticleReader from './pages/ArticleReader';
import BlogManagement from './pages/BlogManagement';

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
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const { setUser } = useStore();
  const [syncing, setSyncing] = useState(true);
  const [syncError, setSyncError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setClerkGetToken(getToken);
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setSyncError(false);
      setSyncing(false);
      return;
    }

    const syncUser = async () => {
      try {
        const res = await api.get('/auth/profile');
        setUser(res.data);
        setSyncError(false);
      } catch (err) {
        console.error('Failed to sync user with database:', err);
        setUser(null);
        setSyncError(true);
      } finally {
        setSyncing(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, clerkUser, setUser]);

  if (syncError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center p-6 font-sans text-white">
        <div className="max-w-md bg-slate-900 border border-red-900/50 p-6 rounded-xl space-y-4 shadow-xl">
          <p className="font-bold text-red-400 text-sm">Account Synchronization Failed</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            We authenticated your session with Clerk, but could not link it to a user account in the database.
          </p>
          <p className="text-[10px] text-slate-500 leading-relaxed font-mono bg-black/40 p-3 rounded border border-slate-800 text-left">
            <strong>Possible cause:</strong> The backend is unable to connect to the PostgreSQL database on Neon, or Clerk secret keys are misconfigured. Check backend logs on Render.
          </p>
          <button
            onClick={async () => {
              try {
                await signOut();
              } catch (e) {
                console.error(e);
              }
              setUser(null);
              setSyncError(false);
              setSyncing(false);
              window.location.href = '/login';
            }}
            className="w-full py-2 bg-red-600 hover:bg-red-750 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Sign Out & Reset
          </button>
        </div>
      </div>
    );
  }

  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  if (!isLoaded || (syncing && !isPublicRoute)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
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
        <Route path="/blogs" element={<ProtectedRoute><BlogsPage /></ProtectedRoute>} />
        <Route path="/blogs/:id" element={<ProtectedRoute><ArticleReader /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/videos" element={<AdminRoute><VideoManagement /></AdminRoute>} />
        <Route path="/admin/blogs" element={<AdminRoute><BlogManagement /></AdminRoute>} />

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
      <div className="min-h-screen bg-[#0C0E14]">
        <ClerkSyncManager>
          <RouteWrapper />
        </ClerkSyncManager>
        
        {/* Global Floating Components */}
        <NotificationToast />
      </div>
    </Router>
  );
}
