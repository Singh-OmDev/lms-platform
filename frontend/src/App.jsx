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

  // Single effect: set the token first, THEN sync — avoids the race condition
  // where syncUser fires before clerkGetToken is populated
  useEffect(() => {
    // Always keep the module-level ref fresh
    setClerkGetToken(getToken);

    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setSyncError(false);
      setSyncing(false);
      return;
    }

    const syncUser = async (retries = 1) => {
      try {
        // Pass getToken directly so we don't rely on the module ref timing
        const token = await getToken();
        const res = await api.get('/auth/profile', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setUser(res.data);
        setSyncError(false);
      } catch (err) {
        if (retries > 0) {
          // Wait 1.5s then retry once (handles cold backend starts)
          await new Promise(r => setTimeout(r, 1500));
          return syncUser(retries - 1);
        }
        console.error('Failed to sync user with database:', err);
        setUser(null);
        setSyncError(true);
      } finally {
        setSyncing(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, getToken, clerkUser, setUser]);

  if (syncError) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center gap-4 text-center p-6 font-sans">
        <div className="max-w-md bg-white border border-[#dde3f0] p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="font-bold text-[#1a1a2e] text-[16px]">Account Synchronization Failed</p>
          <p className="text-[13px] text-[#5a6a8a] leading-relaxed">
            We authenticated your session with Clerk, but could not link it to a user account in the database.
          </p>
          <p className="text-[11px] text-[#5a6a8a] leading-relaxed bg-[#f4f6fb] p-3 rounded-lg border border-[#dde3f0] text-left">
            <strong>Possible cause:</strong> The backend is unable to connect to the PostgreSQL database on Neon, or Clerk secret keys are misconfigured. Check backend logs.
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
            className="w-full py-3 bg-[#1a3c8f] hover:bg-[#122c6e] text-white rounded-lg text-[14px] font-bold transition-colors cursor-pointer"
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
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1a3c8f] border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-[#5a6a8a] font-medium">Loading Suraksha.AI…</p>
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
