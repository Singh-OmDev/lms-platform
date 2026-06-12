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
import { useStore } from '../store/useStore';

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme, addToast } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
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

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Courses', path: '/library' },
    { name: 'Settings', path: '/profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push(
      { name: 'Admin Analytics', path: '/admin/dashboard' },
      { name: 'Manage Videos', path: '/admin/videos' }
    );
  }

  const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#1a202c] flex flex-col font-sans">
      {/* Official Government Flag Banner */}
      <div className="bg-[#e2e8f0] border-b border-[#cbd5e0] px-4 md:px-8 py-1.5 text-[11px] text-[#4a5568] flex items-center space-x-2 font-sans select-none">
        <span className="inline-block w-4 h-2.5 bg-sky-600 border border-white"></span>
        <span>An official website of the Government of Rajasthan • DoIT&C</span>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#002c6c] border-b-4 border-[#f2a900] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left: Emblem/Badge + Brand Logo */}
            <div className="flex items-center space-x-3.5">
              <Link to="/" className="flex items-center space-x-3.5 group">
                <img 
                  src="/rajasthan_logo.png" 

                  alt="Rajasthan Government Emblem" 
                  className="w-10 h-10 object-contain flex-shrink-0 bg-white rounded-full p-0.5 border border-[#f2a900] transition-transform group-hover:scale-105" 
                />
                <div>
                  <span className="text-[9px] font-bold text-[#f2a900] uppercase tracking-wider block font-sans">Government of Rajasthan</span>
                  <span className="font-serif font-bold text-sm sm:text-base leading-tight tracking-wide text-white transition-colors group-hover:text-neutral-200 block">
                    AI & Cyber Security Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Accessibility Controls & User Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Accessibility Placeholders */}
              <div className="hidden md:flex items-center space-x-3 text-xs text-neutral-300 font-semibold border-r border-[#001f4d] pr-4 select-none">
                <button className="hover:text-white cursor-pointer" onClick={() => addToast('Font scaling is managed by system settings', 'info')}>A+</button>
                <button className="hover:text-white cursor-pointer" onClick={() => addToast('Font scaling is managed by system settings', 'info')}>A</button>
                <span className="text-[#001f4d]">|</span>
                <span className="text-white">EN</span>
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
                    <div className="w-9 h-9 rounded bg-[#f2a900] border border-[#d4af37] text-[#002c6c] flex items-center justify-center font-bold text-sm uppercase select-none transition-colors group-hover:bg-[#d99700]">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-300 group-hover:text-white" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-sm bg-white border border-[#cbd5e0] shadow-xl py-1 text-[#1a202c] z-50 animate-in fade-in duration-100 text-xs font-sans">
                      <div className="px-4 py-3 border-b border-[#e2e8f0]">
                        <p className="font-bold text-[#002c6c] truncate">{user.name}</p>
                        <p className="text-neutral-500 truncate mt-0.5">{user.email || 'user@lms.com'}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase bg-[#f0f4f8] text-[#002c6c] border border-[#cbd5e0]">
                          {user.role} Account
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#f0f4f8] hover:text-[#002c6c] transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        Settings Dossier
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#f0f4f8] hover:text-[#002c6c] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Admin Console
                        </Link>
                      )}
                      <div className="border-t border-[#e2e8f0] my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out Portal
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
                      ? 'border-[#002c6c] text-[#002c6c]'
                      : 'border-transparent text-[#4a5568] hover:text-[#002c6c]'
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
      <footer className="border-t border-[#cbd5e0] bg-[#001f4d] py-12 mt-auto text-white text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#002c6c]">
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <img src="/rajasthan_logo.png" alt="Government of Rajasthan Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 border border-[#f2a900]" />
                <span className="font-serif font-bold tracking-wide text-sm">AI & Cyber Security Hub</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                An official education & compliance repository managed by the Department of Information Technology & Communication, Government of Rajasthan.
              </p>
            </div>
            <div className="space-y-2.5">
              <h4 className="font-semibold text-[#f2a900] uppercase tracking-wider text-[10px]">Portal Links</h4>
              <ul className="space-y-1.5 text-neutral-300">
                <li><a href="#" className="hover:text-white">Government Circulars</a></li>
                <li><a href="#" className="hover:text-white">Compliance Guidelines</a></li>
                <li><a href="#" className="hover:text-white">Privacy Statement</a></li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="font-semibold text-[#f2a900] uppercase tracking-wider text-[10px]">Portal Support</h4>
              <p className="text-neutral-300">Support Desk: 1800-DOIT-RAJS</p>
              <p className="text-neutral-400">Email: support.lms@rajasthan.gov.in</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-400">
            <span>© 2026 Department of IT & Communication, Government of Rajasthan. Official Portal.</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white">Accessibility Desk</a>
              <a href="#" className="hover:text-white">RTI Request</a>
              <a href="#" className="hover:text-white">Platform Disclaimers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
