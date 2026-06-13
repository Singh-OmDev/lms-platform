import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

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

  // Theme State
  theme: localStorage.getItem('lms_theme') || 'dark',
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('lms_theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ theme: nextTheme });
  },

  // Initialize theme on app boot
  initTheme: () => {
    const theme = get().theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
