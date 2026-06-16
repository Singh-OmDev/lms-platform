import React, { useEffect, useState } from 'react';
import { Award, Shield, User, LogOut, Key, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } })
};

export default function ProfilePage() {
  const { user, logout } = useStore();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/stats');
        setProfileData(res.data);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try { await signOut(); } catch { /* silent */ }
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-48 bg-white rounded-2xl border border-[#dde3f0]" />
      </div>
    );
  }

  const { stats } = profileData || {};

  const statCards = [
    { icon: BookOpen,    label: t('profile.completedCurriculum'),  value: `${stats?.videosCompleted || 0}`,   sub: t('profile.modulesCompleted') },
    { icon: TrendingUp,  label: 'Completion Rate',                  value: `${stats?.completionRate || 0}%`,   sub: 'of enrolled courses' },
    { icon: Award,       label: 'Certificates Earned',              value: `${stats?.certificatesEarned || 0}`, sub: 'official certifications' },
  ];

  return (
    <div className="space-y-8 pb-16">

      {/* ── Page title ──────────────────────────────────── */}
      <div className="space-y-1">
        <p className="section-label">{t('profile.title')}</p>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{t('profile.title')}</h1>
        <p className="text-[#5a6a8a] text-sm">{t('profile.subtitle')}</p>
      </div>

      {/* ── Stats strip ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value, sub }, i) => (
          <motion.div key={label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
            className="lms-card p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f4821e]/10 border border-[#f4821e]/20 flex items-center justify-center text-[#f4821e] flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1a2e]">{value}</p>
              <p className="text-[10px] font-medium text-[#5a6a8a] uppercase tracking-wider">{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main panel ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Profile info */}
        <div className="lg:col-span-2 space-y-5">

          {/* User card */}
          <div className="lms-card p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#dde3f0]">
              <User className="w-4 h-4 text-[#f4821e]" />
              <h3 className="text-xs font-bold text-[#1a3c8f] uppercase tracking-widest">{t('profile.generalDossier')}</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#f4821e] text-white flex items-center justify-center font-bold text-2xl uppercase select-none shadow-lg shadow-[#f4821e]/20 flex-shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-xl text-[#1a1a2e]">{user?.name}</h2>
                <p className="text-[#5a6a8a] text-sm mt-0.5">{user?.email}</p>
                <span className="badge badge-accent mt-1.5">
                  {user?.role === 'admin' ? t('profile.instructor') : t('profile.student')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { label: t('profile.fullName'),            value: user?.name },
                { label: t('profile.emailAddress'),        value: user?.email },
                { label: t('profile.deptRole'),            value: user?.role === 'admin' ? t('profile.instructor') : t('profile.student') },
                { label: t('profile.completedCurriculum'), value: `${stats?.videosCompleted || 0} ${t('profile.modulesCompleted')}` },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <span className="text-[9px] font-medium text-[#5a6a8a] uppercase tracking-widest block">{label}</span>
                  <p className="font-bold text-[#1a1a2e] text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-3 p-5 bg-[#f4821e]/5 border border-[#f4821e]/15 rounded-2xl">
            <Key className="w-5 h-5 text-[#f4821e] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#5a6a8a] leading-relaxed">
              <strong className="text-[#f4821e]">{t('profile.securityNotice')}</strong>{' '}
              {t('profile.clerkNotice')}
            </div>
          </div>
        </div>

        {/* Right: Session panel */}
        <div className="space-y-4">
          <div className="lms-card p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-[#dde3f0]">
              <Shield className="w-4 h-4 text-[#f4821e]" />
              <h3 className="text-xs font-bold text-[#1a3c8f] uppercase tracking-widest">{t('profile.sessionDossier')}</h3>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="w-20 h-20 rounded-2xl bg-[#f4821e] text-white flex items-center justify-center font-bold text-3xl uppercase shadow-lg shadow-[#f4821e]/20 select-none">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a2e] text-sm">{user?.name}</h4>
                <p className="text-[#5a6a8a] text-[11px] mt-0.5 font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 p-3 bg-[#22C55E]/5 border border-[#22C55E]/15 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
              <span className="text-xs font-mono text-[#22C55E]">Session Active</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full btn-danger flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> {t('nav.signOut')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
