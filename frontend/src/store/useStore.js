import { create } from 'zustand';
import axios from 'axios';

let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
if (rawApiUrl && !rawApiUrl.endsWith('/api') && !rawApiUrl.endsWith('/api/')) {
  rawApiUrl = rawApiUrl.endsWith('/') ? `${rawApiUrl}api` : `${rawApiUrl}/api`;
}
const API_BASE = rawApiUrl;

// Create configured axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let clerkGetToken = null;
export const setClerkGetToken = (fn) => {
  clerkGetToken = fn;
};

api.interceptors.request.use(async (config) => {
  if (clerkGetToken) {
    try {
      const token = await clerkGetToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error fetching Clerk token:', err);
    }
  }
  return config;
});

export const useStore = create((set, get) => ({
  // Auth State
  user: JSON.parse(localStorage.getItem('lms_user')) || null,
  isAuthenticated: !!localStorage.getItem('lms_user'),
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('lms_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem('lms_user');
      set({ user: null, isAuthenticated: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('lms_user');
    set({ user: null, isAuthenticated: false });
    get().addToast('Logged out successfully', 'info');
  },

  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };
    localStorage.setItem('lms_user', JSON.stringify(updated));
    set({ user: updated });
  },

  // Language State
  language: localStorage.getItem('lms_language') || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('lms_language', lang);
    set({ language: lang });
  },

  // Theme State
  theme: 'light',
  toggleTheme: () => {
    set({ theme: 'light' });
  },

  // Initialize theme on app boot
  initTheme: () => {
    localStorage.setItem('lms_theme', 'light');
    document.documentElement.classList.remove('dark');
  },

  // Toasts Notifications State
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    
    // Auto remove toast after 4s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

}));

// Add 401 Interceptor to clear stale sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('lms_user');
      useStore.setState({ user: null, isAuthenticated: false });
      if (window.Clerk) {
        window.Clerk.signOut();
      }
      if (
        window.location.pathname !== '/login' && 
        window.location.pathname !== '/register' && 
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
