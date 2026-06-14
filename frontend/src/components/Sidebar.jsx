import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Sun,
  LogOut,
  User,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme, addToast } = useStore();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
    try {
      await signOut();
    } catch (err) {
      console.error('Clerk sign out error:', err);
    }
    logout();
    addToast(t('common.loggedOutToast'), 'info');
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [];
  
  if (user?.role === 'admin') {
    navItems.push(
      { name: t('nav.adminAnalytics'), path: '/admin/dashboard' },
      { name: t('nav.manageVideos'), path: '/admin/videos' },
      { name: t('nav.manageBlogs'), path: '/admin/blogs' },
      { name: t('nav.viewBlogsFeed'), path: '/blogs' }
    );
  } else {
    navItems.push(
      { name: t('nav.home'), path: '/dashboard' },
      { name: t('nav.courses'), path: '/library' },
      { name: t('nav.blogs'), path: '/blogs' },
      { name: t('nav.certificates'), path: '/certificates' },
      { name: t('nav.profile'), path: '/profile' }
    );
  }

  const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#1a202c] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0A2540] border-b-4 border-[#D4AF37] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left: Emblem/Badge + Brand Logo */}
            <div className="flex items-center space-x-3.5">
              <Link to="/" className="flex items-center space-x-3.5 group">
                <img 
                  src="/rajasthan_logo.png" 
                  alt={t('common.govEmblemAlt')} 
                  className="w-10 h-10 object-contain flex-shrink-0 bg-white rounded-full p-0.5 border border-[#D4AF37] transition-transform group-hover:scale-105" 
                />
                <div>
                  <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider block font-sans">
                    {t('common.govOfRaj')}
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base leading-tight tracking-wide text-white transition-colors group-hover:text-neutral-200 block">
                    {t('common.hubTitle')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Accessibility Controls & User Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Accessibility Controls & Language Selector */}
              <div className="hidden md:flex items-center space-x-3 text-xs text-neutral-300 font-semibold border-r border-[#001f4d] pr-4 select-none">
                <button className="hover:text-white cursor-pointer" onClick={() => addToast(t('common.systemSettingsFont'), 'info')}>A+</button>
                <button className="hover:text-white cursor-pointer" onClick={() => addToast(t('common.systemSettingsFont'), 'info')}>A</button>
                <span className="text-[#001f4d]">|</span>
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="hover:text-white text-[#D4AF37] font-bold cursor-pointer transition-colors px-2 py-0.5 rounded border border-[#D4AF37]/50 hover:border-[#D4AF37] bg-white/5 hover:bg-white/10 active:scale-95 text-[10px]"
                >
                  {language === 'en' ? 'हिन्दी' : 'EN'}
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-300 hover:text-white rounded-md border border-[#001f4d] bg-[#001a40] hover:border-neutral-500 transition-colors cursor-pointer"
                aria-label="Toggle Theme Contrast"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Profile Dropdown */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded bg-[#D4AF37] border border-[#d4af37] text-[#0A2540] flex items-center justify-center font-bold text-sm uppercase select-none transition-colors group-hover:bg-[#d99700]">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-300 group-hover:text-white" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-sm bg-white border border-[#cbd5e0] shadow-xl py-1 text-[#1a202c] z-50 animate-in fade-in duration-100 text-xs font-sans">
                      <div className="px-4 py-3 border-b border-[#e2e8f0]">
                        <p className="font-bold text-[#0A2540] truncate">{user.name}</p>
                        <p className="text-neutral-500 truncate mt-0.5">{user.email || 'user@lms.com'}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase bg-[#f0f4f8] text-[#0A2540] border border-[#cbd5e0]">
                          {user.role === 'admin' ? t('profile.instructor') : t('profile.student')}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#f0f4f8] hover:text-[#0A2540] transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        {t('nav.settingsDossier')}
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#f0f4f8] hover:text-[#0A2540] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {t('nav.adminConsole')}
                        </Link>
                      )}
                      <div className="border-t border-[#e2e8f0] my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom subnav row */}
        <div className="bg-[#f8fafc] border-b border-[#cbd5e0] text-[#4a5568]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <nav className="flex space-x-6 overflow-x-auto scrollbar-none">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`py-3.5 text-xs font-bold border-b-4 whitespace-nowrap transition-colors duration-150 ${
                    isActive(item.path)
                      ? 'border-[#0A2540] text-[#0A2540]'
                      : 'border-transparent text-[#4a5568] hover:text-[#0A2540]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#cbd5e0] bg-[#071A2E] py-16 mt-auto text-white text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#0f2d4a]">
            {/* Col 1: Branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <img src="/rajasthan_logo.png" alt={t('common.govEmblemAlt')} className="w-9 h-9 object-contain bg-white rounded-full p-0.5 border border-[#D4AF37]" />
                <div>
                  <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {t('common.statePortal')}
                  </span>
                  <span className="font-serif font-bold tracking-wide text-sm text-white">
                    {t('common.aiCyberHub')}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {t('common.compliancedesc')}
              </p>
            </div>
            
            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">
                {t('common.adminLinks')}
              </h4>
              <ul className="space-y-2 text-gray-300 text-[11px]">
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.gazettes')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.rti')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.audit')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.accessibility')}</a></li>
              </ul>
            </div>
            
            {/* Col 3: Support Contact */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">
                {t('common.contacts')}
              </h4>
              <div className="space-y-2 text-gray-300 text-[11px]">
                <p><strong>{t('common.supportDesk')}</strong></p>
                <p><strong>{t('common.emailDesk')}</strong></p>
                <p className="text-gray-450 leading-normal">
                  {t('common.address')}
                </p>
              </div>
            </div>
            
            {/* Col 4: Interactive alerts form */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">
                {t('common.bulletins')}
              </h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {t('common.bulletinsDesc')}
              </p>
              
              {subscribed ? (
                <div className="p-3 bg-[#0a2540]/60 border border-emerald-500/30 rounded-md text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
                  <span>✓ {t('common.subscribeBulletinsSuccess')}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5">
                  <input
                    type="email"
                    placeholder={t('common.enterEmail')}
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-gray-500 outline-none focus:border-[#D4AF37] flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
                  >
                    {t('common.subscribe')}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Footer Sub-links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
            <span>{t('common.copyright')}</span>
            <div className="flex space-x-6">
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
