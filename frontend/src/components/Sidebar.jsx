import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut, User, Shield, ChevronDown, LayoutDashboard,
  BookOpen, FileText, Award, UserCircle, BarChart3, Video, PenSquare, Rss
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, addToast } = useStore();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const dropdownRef = useRef(null);
  const { t, language, setLanguage } = useTranslation();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !subscribeEmail.includes('@')) {
      addToast(t('common.emailValidError'), 'danger');
      return;
    }
    setSubscribed(true);
    addToast(t('common.subscribeSuccess'), 'success');
  };

  const handleLogout = async () => {
    try { await signOut(); } catch (err) { console.error('Clerk sign out error:', err); }
    logout();
    addToast(t('common.loggedOutToast'), 'info');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminNavItems = [
    { name: t('nav.adminAnalytics'), path: '/admin/dashboard', icon: BarChart3 },
    { name: t('nav.manageVideos'),   path: '/admin/videos',    icon: Video },
    { name: t('nav.manageBlogs'),    path: '/admin/blogs',      icon: PenSquare },
    { name: t('nav.viewBlogsFeed'),  path: '/blogs',            icon: Rss },
  ];

  const userNavItems = [
    { name: t('nav.home'),         path: '/dashboard',    icon: LayoutDashboard },
    { name: t('nav.courses'),      path: '/library',      icon: BookOpen },
    { name: t('nav.blogs'),        path: '/blogs',        icon: FileText },
    { name: t('nav.certificates'), path: '/certificates', icon: Award },
    { name: t('nav.profile'),      path: '/profile',      icon: UserCircle },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const isActive = (path) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#0C0E14] text-white flex flex-col font-sans">

      {/* ── Top Navbar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0C0E14] border-b border-[#22283A]">

        {/* Main header row */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-[#F5A623]" />
              </div>
              <div>
                <div className="text-[8px] font-mono font-medium text-[#F5A623] uppercase tracking-[0.2em] leading-none">
                  {t('common.govOfRaj')}
                </div>
                <div
                  className="font-bold text-sm text-white leading-tight tracking-wide group-hover:text-[#F5A623] transition-colors"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  {t('common.hubTitle')}
                </div>
              </div>
            </Link>

            {/* Right controls */}
            <div className="flex items-center gap-3">

              {/* Language + Accessibility — desktop only */}
              <div className="hidden md:flex items-center gap-2 pr-3 border-r border-[#22283A]">
                <button
                  onClick={() => addToast(t('common.systemSettingsFont'), 'info')}
                  className="text-[11px] font-mono text-[#8B9ABF] hover:text-white transition-colors cursor-pointer"
                >A+</button>
                <button
                  onClick={() => addToast(t('common.systemSettingsFont'), 'info')}
                  className="text-[10px] font-mono text-[#8B9ABF] hover:text-white transition-colors cursor-pointer"
                >A</button>
                <span className="text-[#22283A] mx-1">|</span>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="text-[10px] font-mono font-medium text-[#F5A623] hover:text-[#FFBA45] transition-colors px-2 py-0.5 rounded border border-[#F5A623]/25 hover:border-[#F5A623]/50 bg-[#F5A623]/5 cursor-pointer"
                >
                  {language === 'en' ? 'हिन्दी' : 'EN'}
                </button>
              </div>

              {/* User profile dropdown */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F5A623] text-[#0C0E14] flex items-center justify-center font-bold text-sm uppercase select-none transition-all group-hover:bg-[#FFBA45] group-hover:shadow-[0_0_12px_rgba(245,166,35,0.4)]">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#8B9ABF] group-hover:text-white transition-all ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#13161E] border border-[#22283A] rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-[#22283A]">
                        <p className="font-bold text-white text-sm truncate" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                          {user.name}
                        </p>
                        <p className="text-[#C2CCDF] text-xs truncate mt-0.5">{user.email || 'user@lms.gov'}</p>
                        <span className="badge badge-accent mt-2">
                          {user.role === 'admin' ? t('profile.instructor') : t('profile.student')}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#C2CCDF] hover:bg-[#1A1E2A] hover:text-white transition-colors"
                        >
                          <User className="w-3.5 h-3.5" />
                          {t('nav.settingsDossier')}
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#C2CCDF] hover:bg-[#1A1E2A] hover:text-white transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            {t('nav.adminConsole')}
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#22283A] pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {t('nav.signOut')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-navigation pills */}
        <div className="bg-[#13161E] border-t border-[#22283A]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`subnav-pill flex items-center gap-1.5 ${active ? 'active' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col">
        {children}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[#22283A] bg-[#13161E] mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#22283A]">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[#F5A623]" />
                </div>
                <div>
                  <div className="text-[8px] font-mono text-[#F5A623] uppercase tracking-widest">{t('common.statePortal')}</div>
                  <div className="font-bold text-sm text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{t('common.aiCyberHub')}</div>
                </div>
              </div>
              <p className="text-[#8B9ABF] text-[11px] leading-relaxed">{t('common.compliancedesc')}</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="section-label">{t('common.adminLinks')}</h4>
              <ul className="space-y-2">
                {[t('common.quickLinks.gazettes'), t('common.quickLinks.rti'), t('common.quickLinks.audit'), t('common.quickLinks.accessibility')].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#C2CCDF] text-xs hover:text-[#F5A623] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="section-label">{t('common.contacts')}</h4>
              <div className="space-y-1.5 text-xs text-[#C2CCDF]">
                <p><strong className="text-white">{t('common.supportDesk')}</strong></p>
                <p><strong className="text-white">{t('common.emailDesk')}</strong></p>
                <p className="text-[#8B9ABF] text-[10px] leading-relaxed">{t('common.address')}</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="section-label">{t('common.bulletins')}</h4>
              <p className="text-[#8B9ABF] text-[11px] leading-relaxed">{t('common.bulletinsDesc')}</p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-[#22C55E] text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  {t('common.subscribeBulletinsSuccess')}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('common.enterEmail')}
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#0C0E14] border border-[#22283A] rounded-lg text-xs text-white placeholder-[#8B9ABF] outline-none focus:border-[#F5A623] transition-colors"
                    required
                  />
                  <button type="submit" className="px-3 py-2 bg-[#F5A623] hover:bg-[#FFBA45] text-[#0C0E14] font-bold text-xs rounded-lg transition-colors cursor-pointer">
                    →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-[10px] text-[#8B9ABF] font-mono">
            <span>{t('common.copyright')}</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[#F5A623] transition-colors">{t('common.privacyPolicy')}</a>
              <a href="#" className="hover:text-[#F5A623] transition-colors">{t('common.termsOfUse')}</a>
              <a href="#" className="hover:text-[#F5A623] transition-colors">{t('common.stateDisclaimers')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
