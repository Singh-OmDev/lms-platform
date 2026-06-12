import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, Award } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function NotificationToast() {
  const { toasts, removeToast } = useStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'danger':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-400" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-slate-900/90 text-slate-100 shadow-emerald-950/20';
      case 'danger':
      case 'error':
        return 'border-rose-500/30 bg-slate-900/90 text-slate-100 shadow-rose-950/20';
      case 'info':
        return 'border-sky-500/30 bg-slate-900/90 text-slate-100 shadow-sky-950/20';
      case 'achievement':
        return 'border-amber-500/30 bg-slate-900/90 text-slate-100 shadow-amber-950/20';
      default:
        return 'border-indigo-500/30 bg-slate-900/90 text-slate-100 shadow-indigo-950/20';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg ${getBgClass(
              toast.type
            )}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-grow text-sm font-medium pr-2">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
