import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronRight, BookOpen, Clock, Globe, Award,
  Shield, Users, Target, GraduationCap, Menu, X, ChevronDown,
  Laptop, Briefcase, Lock, Zap, Terminal, ChevronUp
} from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

/* ── Animation variants ──────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.8, 0.25, 1] } }
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/* ── Counter component ───────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        let start = 0;
        const step = () => {
          start += Math.ceil(target / 50);
          if (start >= target) { setCount(target); return; }
          setCount(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const { isAuthenticated } = useStore();
  const [recentArticles, setRecentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingArticles(true);
        const res = await api.get('/articles');
        setRecentArticles(res.data.slice(0, 3));
      } catch { /* silent */ } finally { setLoadingArticles(false); }
    };
    fetch_();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetch_ = async () => {
      try {
        setLoadingCourses(true);
        const res = await api.get('/videos');
        setCourses(res.data.slice(0, 3));
      } catch { /* silent */ } finally { setLoadingCourses(false); }
    };
    fetch_();
  }, [isAuthenticated]);

  const formatDate = (d) => new Date(d).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const staticCourses = [
    { id: 'ai-specialist', title: t('landing.directives.0.title') || 'Artificial Intelligence Specialist Track', description: t('landing.directives.0.description') || 'Neural networks, deep learning models, and AI data pipelines.', category: 'AI', difficulty: 'Beginner', estimatedTime: '45 hrs', thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop' },
    { id: 'security-analyst', title: t('landing.directives.1.title') || 'Cybersecurity Defense Analyst Track', description: t('landing.directives.1.description') || 'System auditing, pen-testing, network protocol verification.', category: 'Cyber Security', difficulty: 'Medium', estimatedTime: '60 hrs', thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop' },
    { id: 'infra-defense', title: 'Advanced Infrastructure Penetration Defense', description: 'Secure cloud architectures, database ledgers, emergency defense drills.', category: 'Cyber Security', difficulty: 'Expert', estimatedTime: '30 hrs', thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop' }
  ];

  const displayedCourses = isAuthenticated && courses.length > 0 ? courses : staticCourses;

  const getCategoryBadgeClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'ai': return 'badge badge-blue';
      case 'cybersecurity':
      case 'cyber security': return 'badge badge-purple';
      default: return 'badge badge-accent';
    }
  };

  return (
    <div className="bg-[#0C0E14] text-white min-h-screen font-sans">


      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0C0E14]/95 backdrop-blur-md border-b border-[#22283A]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/25 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F5A623]/20 transition-colors">
              <Shield className="w-4.5 h-4.5 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-[8px] font-mono font-medium text-[#F5A623] uppercase tracking-[0.2em] leading-none">{t('common.govOfRaj')}</div>
              <div className="font-bold text-sm text-white tracking-wide group-hover:text-[#F5A623] transition-colors" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                {t('common.hubTitle')}
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            <Link to="/" className="text-sm font-medium text-[#C2CCDF] hover:text-white transition-colors nav-link-underline">{t('nav.home')}</Link>

            {/* Pages dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                className="flex items-center gap-1 text-sm font-medium text-[#C2CCDF] hover:text-white transition-colors cursor-pointer"
              >
                {t('nav.pages')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-3 w-56 bg-[#13161E] border border-[#22283A] rounded-xl shadow-2xl shadow-black/60 p-2 z-50"
                  >
                    <p className="px-3 py-1.5 text-[9px] font-mono text-[#8B9ABF] uppercase tracking-widest">{t('nav.navigationPortal')}</p>
                    {(isAuthenticated ? [
                      { to: '/dashboard',    label: t('nav.consoleDashboard')   },
                      { to: '/profile',      label: t('nav.profileDetails')     },
                      { to: '/certificates', label: t('nav.certificatesCenter') },
                    ] : [
                      { to: '/login',    label: t('nav.signInPortal') },
                      { to: '/register', label: t('nav.createAccount') },
                    ]).map(link => (
                      <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-lg text-xs font-medium text-[#C2CCDF] hover:bg-[#1A1E2A] hover:text-[#F5A623] transition-all">
                        {link.label}
                      </Link>
                    ))}
                    <Link to="/blogs" className="block px-3 py-2 rounded-lg text-xs font-medium text-[#C2CCDF] hover:bg-[#1A1E2A] hover:text-[#F5A623] transition-all">
                      {t('nav.publicationsFeed')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#courses-showcase" className="text-sm font-medium text-[#C2CCDF] hover:text-white transition-colors nav-link-underline">{t('nav.courses')}</a>
            <a href="#about-us" className="text-sm font-medium text-[#C2CCDF] hover:text-white transition-colors nav-link-underline">{t('nav.about')}</a>
            <Link to="/blogs" className="text-sm font-medium text-[#C2CCDF] hover:text-white transition-colors nav-link-underline">{t('nav.blogsNav')}</Link>
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#C2CCDF] hover:text-[#F5A623] transition-colors px-2.5 py-1.5 rounded-lg border border-[#22283A] hover:border-[#F5A623]/30 cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-accent px-5 py-2">
                {t('landing.goDashboard')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[#C2CCDF] hover:text-white transition-colors">{t('landing.signIn')}</Link>
                <Link to="/register" className="btn-accent px-5 py-2">{t('landing.register')}</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-[10px] font-mono text-[#C2CCDF] px-2 py-1 border border-[#22283A] rounded"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#C2CCDF] hover:text-[#F5A623] transition-colors p-1">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-[#13161E] border-t border-[#22283A]"
            >
              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-col gap-2">
                  {[
                    { to: '/', label: t('nav.home') },
                    { href: '#courses-showcase', label: t('nav.courses') },
                    { href: '#about-us', label: t('nav.about') },
                    { to: '/blogs', label: t('nav.blogsNav') },
                  ].map((item) => item.to
                    ? <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#C2CCDF] py-1 hover:text-[#F5A623] transition-colors">{item.label}</Link>
                    : <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#C2CCDF] py-1 hover:text-[#F5A623] transition-colors">{item.label}</a>
                  )}
                </div>
                <div className="border-t border-[#22283A] pt-4 flex flex-col gap-2">
                  {isAuthenticated
                    ? <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-accent py-3 text-center">{t('landing.goDashboard')}</Link>
                    : <>
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost py-3 text-center">{t('landing.signIn')}</Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-accent py-3 text-center">{t('landing.register')}</Link>
                      </>
                  }
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════════════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden grid-pattern min-h-[90vh] flex items-center">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F5A623]/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#60A5FA]/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Gov badge */}
            <div className="gov-badge w-fit">
              <Lock className="w-2.5 h-2.5" />
              {t('auth.stateDefenseRegistry')}
            </div>

            {/* Main headline */}
            <div className="space-y-3">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {language === 'hi' ? (
                  <>
                    कौशल बढ़ाएँ,<br />
                    <span className="text-[#F5A623]">भविष्य बनाएँ।</span>
                  </>
                ) : (
                  <>
                    Grow your skills,<br />
                    <span className="text-[#F5A623]">define your future.</span>
                  </>
                )}
              </h1>
              <div className="accent-rule" />
            </div>

            <p className="text-[#C2CCDF] text-base sm:text-lg leading-relaxed max-w-xl">
              {t('landing.heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-accent px-8 py-3.5 text-sm">
                  {t('landing.goDashboard')} <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <a href="#courses-showcase" className="btn-accent px-8 py-3.5 text-sm">
                    {t('nav.courses')} <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link to="/login" className="btn-ghost px-8 py-3.5 text-sm">
                    {t('landing.complianceLogin')}
                  </Link>
                </>
              )}
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { label: 'Officers Trained', value: '2400', suffix: '+' },
                { label: 'Learning Modules',  value: '12',  suffix: '' },
                { label: 'Skill Tracks',      value: '3',   suffix: '' },
              ].map(({ label, value, suffix }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2.5 bg-[#13161E] border border-[#22283A] rounded-xl">
                  <span className="text-xl font-bold text-[#F5A623]" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                    <Counter target={parseInt(value)} suffix={suffix} />
                  </span>
                  <span className="text-xs font-medium text-[#8B9ABF] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — hero visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1], delay: 0.15 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[400px]">
              {/* Decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-8 -right-8 w-28 h-28 border border-dashed border-[#F5A623]/15 rounded-full pointer-events-none"
              />

              {/* Main card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#22283A] shadow-2xl shadow-black/60 group">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
                  alt="Students learning technology"
                  className="w-full h-[420px] object-cover opacity-75 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#0C0E14]/80 backdrop-blur-md border border-[#22283A] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#F5A623]/15 border border-[#F5A623]/25 flex items-center justify-center">
                      <Shield className="w-2.5 h-2.5 text-[#F5A623]" />
                    </div>
                    <span className="text-[9px] font-mono font-medium text-[#F5A623] uppercase tracking-widest">DoIT&C Platform</span>
                  </div>
                  <p className="text-xs font-bold text-white">Rajasthan Technological Training Registry</p>
                </div>
              </div>

              {/* Floating terminal widget */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -left-6 top-1/3 bg-[#13161E] border border-[#22283A] rounded-xl p-3 shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                </div>
                <div className="font-mono text-[10px] text-[#22C55E] space-y-1">
                  <p>$ status: <span className="text-[#F5A623]">SECURE</span></p>
                  <p>$ track: AI_SPECIALIST</p>
                  <p className="text-[#8B9ABF]">▋</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Partner logos strip ─────────────────────────── */}
      <div className="border-y border-[#22283A] bg-[#13161E] py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[9px] font-mono text-[#8B9ABF] uppercase tracking-widest text-center mb-4">
            {language === 'hi' ? 'हमारे छात्र इन संगठनों में कार्यरत हैं' : 'Our personnel serve in leading sectors'}
          </p>
          <div className="flex flex-wrap gap-8 items-center justify-center opacity-40 hover:opacity-70 transition-opacity duration-500">
            {['DoIT&C Rajasthan', 'Natl. Informatics Centre', 'Cyber Security Agency', 'State Data Centre', 'Jaipur InfoTech Cell'].map(org => (
              <span key={org} className="text-xs font-mono font-medium text-[#C2CCDF] whitespace-nowrap">{org}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          2. ABOUT SECTION
      ════════════════════════════════════════════════════ */}
      <motion.section
        id="about-us"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-24 border-b border-[#22283A] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Image */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop"
              alt="Cyber security command room"
              className="relative w-full h-[380px] object-cover rounded-2xl border border-[#22283A] shadow-2xl"
            />
            {/* Amber accent corner */}
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#F5A623]" />
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="section-label mb-2">{t('nav.about')}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                {t('landing.aboutUsHeading')}
              </h2>
              <div className="accent-rule mt-3" />
            </div>
            <p className="text-[#C2CCDF] text-base leading-relaxed">{t('landing.aboutUsDesc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: t('landing.continuousCompliance'), desc: t('landing.continuousComplianceDesc') },
                { title: t('landing.activeVideoRepo'),      desc: t('landing.activeVideoRepoDesc')      },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4 bg-[#13161E] border border-[#22283A] rounded-xl">
                  <div className="w-1 h-full min-h-[2rem] rounded-full bg-[#F5A623] flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{title}</h4>
                    <p className="text-[#8B9ABF] text-xs mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#why-us" className="btn-ghost inline-flex">{t('landing.aboutUsButton')}</a>
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          3. COURSES SECTION
      ════════════════════════════════════════════════════ */}
      <section id="courses-showcase" className="py-24 border-b border-[#22283A] scroll-mt-20 bg-[#13161E]/40">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="section-label mb-2">{t('nav.courses')}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                {t('landing.ourCoursesHeading')}
              </h2>
              <p className="text-[#C2CCDF] text-sm mt-2 max-w-lg">{t('landing.ourCoursesDesc')}</p>
            </div>
            <Link to="/library" className="btn-ghost flex items-center gap-1 text-xs flex-shrink-0">
              {t('landing.allCoursesButton')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingCourses ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-[#13161E] rounded-2xl border border-[#22283A]" />)}
            </div>
          ) : (
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {displayedCourses.map((c, idx) => (
                <motion.div key={c.id || idx} variants={fadeUp} className="lms-card flex flex-col overflow-hidden group">
                  {/* Thumbnail */}
                  <div className="h-44 relative bg-[#0C0E14] overflow-hidden">
                    <img
                      src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                      alt={c.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13161E] via-transparent to-transparent" />
                    <div className={`absolute top-3 left-3 ${getCategoryBadgeClass(c.category)}`}>{c.category}</div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-[#8B9ABF] uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> {c.estimatedTime || 'Self-paced'}
                      <span>·</span> {c.difficulty || 'All Levels'}
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-[#F5A623] transition-colors" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#8B9ABF] line-clamp-2 leading-relaxed flex-1">{c.description}</p>

                    <div className="flex justify-between items-center pt-3 border-t border-[#22283A] mt-auto">
                      <span className="text-[10px] font-mono text-[#F5A623]">{c.price || 'FREE (GOV)'}</span>
                      <Link
                        to={isAuthenticated ? `/video/${c.id || 1}` : '/login'}
                        className="flex items-center gap-1 text-xs font-bold text-[#C2CCDF] hover:text-[#F5A623] transition-colors"
                      >
                        {isAuthenticated ? 'Launch' : 'Enroll'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          4. LEARNING PATHS
      ════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-24 border-b border-[#22283A]"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <p className="section-label">{t('landing.choosePathTitle')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
              {t('landing.choosePathTitle')}
            </h2>
            <p className="text-[#C2CCDF] text-sm">{t('landing.choosePathSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: t('landing.fullTimeTitle'),  desc: t('landing.fullTimeDesc'),  btn: t('landing.fullTimeBtn'),  href: '#about-us' },
              { icon: Briefcase,     title: t('landing.partTimeTitle'),  desc: t('landing.partTimeDesc'),  btn: t('landing.partTimeBtn'),  href: '#about-us' },
              { icon: Laptop,        title: t('landing.onlineTitle'),    desc: t('landing.onlineDesc'),    btn: t('landing.onlineBtn'),    href: '#courses-showcase' },
            ].map(({ icon: Icon, title, desc, btn, href }) => (
              <div key={title} className="lms-card p-6 space-y-4 flex flex-col text-left">
                <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{title}</h3>
                  <p className="text-xs text-[#8B9ABF] mt-1.5 leading-relaxed">{desc}</p>
                </div>
                <a href={href} className="btn-ghost py-2 text-center text-xs mt-auto">{btn}</a>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          5. TESTIMONIAL
      ════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-[#22283A] bg-[#13161E]/30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <p className="section-label">Testimonials</p>

          <blockquote
            className="text-2xl sm:text-3xl font-bold text-white leading-snug"
            style={{fontFamily:'Fraunces,Georgia,serif', fontStyle:'italic'}}
          >
            "{t('landing.testimonialQuote')}"
          </blockquote>

          <div className="flex flex-col items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
              alt="Testimonial author"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#F5A623]/50"
            />
            <div>
              <p className="font-bold text-white text-sm">{t('landing.testimonialAuthor')}</p>
              <p className="text-[#8B9ABF] text-xs font-mono">{t('landing.testimonialRole')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          6. WHY US
      ════════════════════════════════════════════════════ */}
      <motion.section
        id="why-us"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-24 border-b border-[#22283A] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <p className="section-label">Why choose us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
              {t('landing.whyUsTitle')}
            </h2>
            <p className="text-[#C2CCDF] text-sm">{t('landing.whyUsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: GraduationCap, title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
              { icon: Shield,        title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
              { icon: Users,         title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
              { icon: Target,        title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="lms-card p-5 space-y-3 text-left group">
                <div className="w-9 h-9 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] group-hover:bg-[#F5A623]/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{title}</h4>
                <p className="text-[11px] text-[#8B9ABF] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a href="#courses-showcase" className="btn-accent inline-flex px-8 py-3.5">
              {t('nav.courses')} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          7. ARTICLES
      ════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-[#22283A] bg-[#13161E]/20">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="section-label mb-2">{t('nav.blogsNav')}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                {t('landing.learningCenterTitle')}
              </h2>
            </div>
            <Link to="/blogs" className="btn-ghost flex items-center gap-1 text-xs flex-shrink-0">
              {t('landing.moreArticlesBtn')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-56 bg-[#13161E] rounded-2xl border border-[#22283A]" />)}
            </div>
          ) : recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentArticles.map((article, i) => (
                <Link
                  key={article.id}
                  to={`/blogs/${article.id}`}
                  className="lms-card group overflow-hidden flex flex-col"
                >
                  <div className="h-36 relative bg-[#0C0E14] overflow-hidden">
                    <img
                      src={article.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-600"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13161E] to-transparent" />
                    <span className={`absolute top-3 left-3 ${getCategoryBadgeClass(article.category)}`}>{article.category}</span>
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col">
                    <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-[#F5A623] transition-colors leading-snug" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#8B9ABF] line-clamp-2 flex-1 leading-relaxed">{article.summary}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#22283A] mt-auto">
                      <span className="text-[9px] font-mono text-[#8B9ABF]">{formatDate(article.createdAt)}</span>
                      <span className="text-xs font-medium text-[#F5A623] flex items-center gap-0.5">Read <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#8B9ABF] text-sm">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>{t('blogs.noPublications')}</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          8. FULL-WIDTH CTA STRIP
      ════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden border-b border-[#22283A]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623]/8 via-transparent to-[#F5A623]/4" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="gov-badge mx-auto w-fit">
            <Zap className="w-2.5 h-2.5" /> Ready to begin?
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
            Start your training today.
          </h2>
          <p className="text-[#C2CCDF] text-base max-w-xl mx-auto leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated
              ? <Link to="/dashboard" className="btn-accent px-10 py-4 text-sm">{t('landing.goDashboard')} <ArrowRight className="w-4 h-4" /></Link>
              : <>
                  <Link to="/register" className="btn-accent px-10 py-4 text-sm">{t('landing.register')} <ArrowRight className="w-4 h-4" /></Link>
                  <Link to="/login" className="btn-ghost px-10 py-4 text-sm">{t('landing.signIn')}</Link>
                </>
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="bg-[#13161E] border-t border-[#22283A] py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#22283A]">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#F5A623]" />
                </div>
                <div>
                  <div className="text-[8px] font-mono text-[#F5A623] uppercase tracking-widest">{t('common.statePortal')}</div>
                  <div className="font-bold text-sm text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{t('common.aiCyberHub')}</div>
                </div>
              </div>
              <p className="text-[#8B9ABF] text-[11px] leading-relaxed">{t('common.compliancedesc')}</p>
            </div>

            <div className="space-y-3">
              <h4 className="section-label">{t('common.adminLinks')}</h4>
              <ul className="space-y-2">
                {[t('common.quickLinks.gazettes'), t('common.quickLinks.rti'), t('common.quickLinks.audit'), t('common.quickLinks.accessibility')].map(l => (
                  <li key={l}><a href="#" className="text-[#8B9ABF] text-xs hover:text-[#F5A623] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="section-label">{t('common.contacts')}</h4>
              <div className="space-y-1.5 text-xs text-[#8B9ABF]">
                <p><strong className="text-[#C2CCDF]">{t('common.supportDesk')}</strong></p>
                <p><strong className="text-[#C2CCDF]">{t('common.emailDesk')}</strong></p>
                <p className="text-[10px] leading-relaxed">{t('common.address')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="section-label">{t('common.bulletins')}</h4>
              <p className="text-[#8B9ABF] text-[11px] leading-relaxed">{t('common.bulletinsDesc')}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('common.enterEmail')}
                  className="flex-1 px-3 py-2 bg-[#0C0E14] border border-[#22283A] rounded-lg text-xs text-white placeholder-[#8B9ABF] outline-none focus:border-[#F5A623] transition-colors"
                />
                <button className="px-3 py-2 bg-[#F5A623] text-[#0C0E14] font-bold text-sm rounded-lg hover:bg-[#FFBA45] transition-colors cursor-pointer">→</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#8B9ABF] font-mono">
            <span>{t('common.copyright')}</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[#F5A623] transition-colors">{t('common.privacyPolicy')}</a>
              <a href="#" className="hover:text-[#F5A623] transition-colors">{t('common.termsOfUse')}</a>
              <a href="#" className="hover:text-[#F5A623] transition-colors">{t('common.stateDisclaimers')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-[#F5A623] text-[#0C0E14] rounded-xl flex items-center justify-center shadow-lg hover:bg-[#FFBA45] transition-colors cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
