import React, { useEffect, useState } from 'react';
import { Award, Shield, User, LogOut, Key } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Clerk sign out error:', err);
    }
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-6 bg-neutral-300 rounded w-1/4" />
        <div className="h-48 bg-neutral-300 rounded-sm border border-[#cbd5e0]" />
      </div>
    );
  }

  const { stats } = profileData || {};

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      
      {/* Title */}
      <div className="border-b-2 border-[#d2d6dc] pb-4">
        <h1 className="text-xl font-serif font-bold text-[#0A2540] tracking-tight">{t('profile.title')}</h1>
        <p className="text-neutral-500 text-xs mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Profile Card & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: General Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white border border-[#cbd5e0] rounded-sm shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-xs text-[#0A2540] uppercase tracking-wider pb-2 border-b border-[#cbd5e0] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#0A2540]" /> {t('profile.generalDossier')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-normal">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('profile.fullName')}</span>
                <p className="font-bold text-[#0A2540] text-sm">{user?.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('profile.emailAddress')}</span>
                <p className="font-bold text-[#0A2540] text-sm">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('profile.deptRole')}</span>
                <span className="inline-block mt-1 text-[9px] font-mono uppercase bg-[#f0f4f8] text-[#0A2540] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                  {user?.role === 'admin' ? t('profile.instructor') : t('profile.student')}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('profile.completedCurriculum')}</span>
                <p className="font-bold text-[#0A2540] text-sm">{stats?.videosCompleted || 0} {t('profile.modulesCompleted')}</p>
              </div>
            </div>
          </div>

          {/* Clerk Info Callout */}
          <div className="p-5 bg-[#fcf8e3] border border-[#faebcc] rounded-sm text-xs text-[#8a6d3b] flex items-start gap-3 leading-relaxed">
            <Key className="w-5 h-5 text-[#8a6d3b] flex-shrink-0 mt-0.5" />
            <div>
              <strong>{t('profile.securityNotice')}</strong> {t('profile.clerkNotice')}
            </div>
          </div>
        </div>

        {/* Right: Sign Out Panel */}
        <div className="p-5 bg-white border border-[#cbd5e0] rounded-sm shadow-sm h-fit space-y-4 text-center">
          <h3 className="font-serif font-bold text-xs text-[#0A2540] uppercase tracking-wider pb-2 border-b border-[#cbd5e0]">{t('profile.sessionDossier')}</h3>
          
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37] border-2 border-[#d4af37] text-[#0A2540] flex items-center justify-center font-bold text-2xl uppercase mx-auto shadow-sm select-none">
              {user?.name.charAt(0)}
            </div>
            <h4 className="font-bold text-[#0A2540] text-sm mt-3">{user?.name}</h4>
            <p className="text-neutral-500 text-[10px] mt-0.5">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-center flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-750 text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> {t('nav.signOut')}
          </button>
        </div>
      </div>
    </div>
  );
}
