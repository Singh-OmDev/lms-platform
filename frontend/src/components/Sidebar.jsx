import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut, User, Shield, ChevronDown, LayoutDashboard,
  BookOpen, FileText, Award, UserCircle, BarChart3, Video,
  PenSquare, Rss, Globe, ChevronRight, Phone, Mail, MapPin
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
    { name: t('nav.manageBlogs'),    path: '/admin/blogs',     icon: PenSquare },
    { name: t('nav.viewBlogsFeed'),  path: '/blogs',           icon: Rss },
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
    <div className="min-h-screen bg-[#f4f6fb] text-[#1a1a2e] flex flex-col font-sans">

      {/* ── Accessibility Top Bar ───────────────────────── */}
      <div className="bg-[#0d244f] text-white text-[11px] py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white/60">
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <button
            onClick={() => { document.documentElement.style.fontSize = '14px'; }}
            className="hover:text-white transition-colors cursor-pointer font-bold"
            title="Decrease Text Size"
          >
            A-
          </button>
          <button
            onClick={() => { document.documentElement.style.fontSize = '16px'; }}
            className="hover:text-white transition-colors cursor-pointer font-bold"
            title="Reset Text Size"
          >
            A
          </button>
          <button
            onClick={() => { document.documentElement.style.fontSize = '18px'; }}
            className="hover:text-white transition-colors cursor-pointer font-bold"
            title="Increase Text Size"
          >
            A+
          </button>
          <span className="opacity-30">|</span>
          {/* ── Language Toggle — visible & functional ── */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 bg-[#f4821e] text-white px-3 py-0.5 rounded-full font-semibold hover:bg-[#d96a0a] transition-all cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>

      {/* ── Top Navbar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dde3f0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex h-[60px] items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-[#1a3c8f] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">सु</span>
              </div>
              <div className="leading-tight">
                <div className="text-[9px] font-semibold text-[#5a6a8a] uppercase tracking-widest leading-none">
                  {t('common.govOfRaj')}
                </div>
                <div className="font-bold text-[14px] text-[#1a3c8f] leading-tight group-hover:text-[#f4821e] transition-colors">
                  {t('common.hubTitle')}
                </div>
              </div>
            </Link>

            {/* Right controls */}
            <div className="flex items-center gap-3">

              {/* User profile dropdown */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer group bg-[#f4f6fb] border border-[#dde3f0] rounded-lg px-3 py-2 hover:border-[#1a3c8f] transition-all"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#1a3c8f] text-white flex items-center justify-center font-bold text-sm uppercase select-none">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-[13px] font-semibold text-[#1a1a2e] max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#5a6a8a] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#dde3f0] rounded-xl shadow-xl shadow-black/10 py-1.5 z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-[#dde3f0]">
                        <p className="font-bold text-[#1a1a2e] text-[14px] truncate">{user.name}</p>
                        <p className="text-[#5a6a8a] text-[12px] truncate mt-0.5">{user.email || 'user@lms.gov'}</p>
                        <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8edf9] text-[#1a3c8f]">
                          {user.role === 'admin' ? t('profile.instructor') : t('profile.student')}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-[#1a1a2e] hover:bg-[#f4f6fb] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#5a6a8a]" />
                          {t('nav.profile')}
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-[#1a1a2e] hover:bg-[#f4f6fb] transition-colors"
                          >
                            <Shield className="w-4 h-4 text-[#5a6a8a]" />
                            {t('nav.adminConsole')}
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#dde3f0] pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
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

        {/* Sub-navigation tabs */}
        <div className="bg-[#f4f6fb] border-t border-[#dde3f0]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <nav className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#1a3c8f] text-white shadow-sm'
                        : 'text-[#5a6a8a] hover:bg-white hover:text-[#1a3c8f] hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────── */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-[#0d244f] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ल</span>
                </div>
                <div>
                  <div className="text-[9px] font-semibold text-white/50 uppercase tracking-widest">{t('common.statePortal')}</div>
                  <div className="font-bold text-[14px] text-white">{t('common.aiCyberHub')}</div>
                </div>
              </div>
              <p className="text-white/55 text-[12px] leading-relaxed">{t('common.compliancedesc')}</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40">{t('common.adminLinks')}</h4>
              <ul className="space-y-2">
                {[t('common.quickLinks.gazettes'), t('common.quickLinks.rti'), t('common.quickLinks.audit'), t('common.quickLinks.accessibility')].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 text-[13px] hover:text-white transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3" /> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40">{t('common.contacts')}</h4>
              <div className="space-y-2 text-[13px] text-white/60">
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#f4821e]" />{t('common.supportDesk')}</p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#f4821e]" />{t('common.emailDesk')}</p>
                <p className="flex items-start gap-2 text-[12px]"><MapPin className="w-3.5 h-3.5 text-[#f4821e] mt-0.5 flex-shrink-0" />{t('common.address')}</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40">{t('common.bulletins')}</h4>
              <p className="text-white/55 text-[12px] leading-relaxed">{t('common.bulletinsDesc')}</p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-[#138808] text-[13px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                  {t('common.subscribeBulletinsSuccess')}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('common.enterEmail')}
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-[13px] text-white placeholder-white/40 outline-none focus:border-[#f4821e] transition-colors"
                    required
                  />
                  <button type="submit" className="px-3 py-2 bg-[#f4821e] hover:bg-[#d96a0a] text-white font-bold text-[13px] rounded-lg transition-colors cursor-pointer">
                    →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-[11px] text-white/40">
            <span>{t('common.copyright')}</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">{t('common.privacyPolicy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('common.termsOfUse')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('common.stateDisclaimers')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
