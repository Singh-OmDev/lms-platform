import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Clock, ChevronRight, Sparkles, BookOpen,
  Calendar, MapPin, Menu, X, ChevronDown, Globe, Award, Shield, Users, Target,
  Laptop, Briefcase, GraduationCap, ChevronUp
} from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

// Fade-in variant for sections
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const { isAuthenticated } = useStore();
  const [recentArticles, setRecentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { t, language, setLanguage } = useTranslation();

  // Scroll to top button visibility check
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        setLoadingArticles(true);
        const res = await api.get('/articles');
        setRecentArticles(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing page articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchRecentArticles();
  }, []);

  // Fetch courses dynamically if authenticated
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated) return;
      try {
        setLoadingCourses(true);
        const res = await api.get('/videos');
        setCourses(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [isAuthenticated]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !subscribeEmail.includes('@')) {
      alert(t('common.emailValidError'));
      return;
    }
    setSubscribed(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Static Fallback/Preview Courses
  const staticCourses = [
    {
      id: 'ai-specialist',
      title: t('landing.directives.0.title') || 'Artificial Intelligence Specialist Track',
      description: t('landing.directives.0.description') || 'Access certified training curriculum covering neural networks, deep learning models, and data pipelines.',
      category: 'AI',
      difficulty: 'Beginner',
      estimatedTime: '45 hrs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'security-analyst',
      title: t('landing.directives.1.title') || 'Cybersecurity Defense Analyst Track',
      description: t('landing.directives.1.description') || 'Learn system auditing, pen-testing metrics, network protocol verification, and cloud security frameworks.',
      category: 'Cyber Security',
      difficulty: 'Medium',
      estimatedTime: '60 hrs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'infra-defense',
      title: 'Advanced Infrastructure Penetration Defense',
      description: 'Deep dive into secure cloud architectures, database ledgers, compliance auditing, and emergency defense drills.',
      category: 'Cyber Security',
      difficulty: 'Expert',
      estimatedTime: '30 hrs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const displayedCourses = isAuthenticated && courses.length > 0 ? courses : staticCourses;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#07172A] text-slate-800 dark:text-slate-100 min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#0A2540] font-sans flex flex-col transition-colors duration-200 scroll-smooth">
      
      {/* Official Government Banner */}
      <div className="bg-slate-250 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 px-6 py-2 text-[11px] text-slate-600 dark:text-slate-400 flex items-center space-x-2 select-none font-medium">
        <span className="inline-block w-4.5 h-3 bg-sky-600 border border-white"></span>
        <span>{t('landing.officialBanner')}</span>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b-4 border-[#D4AF37] bg-[#0A2540] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo Branding */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/rajasthan_logo.png"
              alt={t('common.govEmblemAlt')}
              className="w-11 h-11 object-contain bg-white rounded-full p-0.5 border border-[#D4AF37] transition-transform group-hover:scale-105"
            />
            <div>
              <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider block">{t('common.govOfRaj')}</span>
              <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-white transition-colors group-hover:text-neutral-200 block">
                {t('common.hubTitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold text-neutral-200 hover:text-white nav-link-underline">
              {t('nav.home')}
            </Link>
            
            {/* Pages Dropdown with AnimatePresence */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="text-sm font-semibold text-neutral-200 hover:text-white flex items-center gap-1 focus:outline-none transition-colors cursor-pointer"
              >
                {t('nav.pages')} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-[#0E2035] rounded-md shadow-xl border border-slate-200/80 dark:border-slate-800 p-2.5 text-slate-800 dark:text-slate-100 z-50"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-3 py-1.5 mb-1">{t('nav.navigationPortal')}</span>
                      {isAuthenticated ? (
                        <>
                          <Link to="/dashboard" className="block px-3 py-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2E44] hover:text-[#0A2540] dark:hover:text-[#D4AF37] transition-all cursor-pointer">{t('nav.consoleDashboard')}</Link>
                          <Link to="/profile" className="block px-3 py-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2E44] hover:text-[#0A2540] dark:hover:text-[#D4AF37] transition-all cursor-pointer">{t('nav.profileDetails')}</Link>
                          <Link to="/certificates" className="block px-3 py-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2E44] hover:text-[#0A2540] dark:hover:text-[#D4AF37] transition-all cursor-pointer">{t('nav.certificatesCenter')}</Link>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-3 py-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2E44] hover:text-[#0A2540] dark:hover:text-[#D4AF37] transition-all cursor-pointer">{t('nav.signInPortal')}</Link>
                          <Link to="/register" className="block px-3 py-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2E44] hover:text-[#0A2540] dark:hover:text-[#D4AF37] transition-all cursor-pointer">{t('nav.createAccount')}</Link>
                        </>
                      )}
                      <Link to="/blogs" className="block px-3 py-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2E44] hover:text-[#0A2540] dark:hover:text-[#D4AF37] transition-all cursor-pointer">{t('nav.publicationsFeed')}</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#courses-showcase" className="text-sm font-semibold text-neutral-200 hover:text-white nav-link-underline">
              {t('nav.courses')}
            </a>
            <a href="#about-us" className="text-sm font-semibold text-neutral-200 hover:text-white nav-link-underline">
              {t('nav.about')}
            </a>
            <Link to="/blogs" className="text-sm font-semibold text-neutral-200 hover:text-white nav-link-underline">
              {t('nav.blogsNav')}
            </Link>
          </div>

          {/* Desktop Right Hand Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs font-bold text-neutral-200 hover:text-white transition-colors px-2.5 py-1 rounded border border-neutral-600 bg-white/5 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-gold px-5 py-2 text-xs font-bold uppercase tracking-wider">
                {t('landing.goDashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold text-neutral-300 hover:text-white transition-colors">
                  {t('landing.signIn')}
                </Link>
                <Link to="/register" className="btn-gold px-5 py-2 text-xs font-bold uppercase tracking-wider">
                  {t('landing.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs font-bold text-neutral-200 px-2 py-1 rounded border border-neutral-600 bg-white/5 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-[#D4AF37]" />
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-[#D4AF37] focus:outline-none transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden bg-[#0A2540] border-t border-neutral-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-250">
            <div className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-neutral-200 py-1 hover:text-white">
                {t('nav.home')}
              </Link>
              <a href="#courses-showcase" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-neutral-200 py-1 hover:text-white">
                {t('nav.courses')}
              </a>
              <a href="#about-us" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-neutral-200 py-1 hover:text-white">
                About
              </a>
              <Link to="/blogs" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-neutral-200 py-1 hover:text-white">
                Blogs
              </Link>
            </div>
            
            <div className="border-t border-neutral-800 pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-gold py-2.5 text-xs text-center font-bold uppercase tracking-wider">
                  {t('landing.goDashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="border border-neutral-600 text-center py-2 rounded text-xs font-semibold hover:bg-white/5">
                    {t('landing.signIn')}
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-gold py-2.5 text-xs text-center font-bold uppercase tracking-wider">
                    {t('landing.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#07172A] dark:via-[#0E2035] dark:to-[#07172A] py-20 md:py-32 border-b border-slate-200 dark:border-slate-800">
        
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-80 h-80 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/2 rounded-full blur-3xl pointer-events-none select-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-[#0A2540]/5 dark:bg-[#0A2540]/2 rounded-full blur-3xl pointer-events-none select-none" 
        />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Details with Slide-In */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full px-4.5 py-1.5 text-xs text-[#b08b1b] dark:text-[#D4AF37] font-semibold backdrop-blur-md select-none">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>{t('landing.authorizedCurriculum')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.12] text-[#0A2540] dark:text-white tracking-tight">
              Grow your skills, <br />
              <span className="text-[#D4AF37] relative inline-block">
                define your future
                <span className="absolute bottom-1.5 left-0 w-full h-1 bg-[#D4AF37]/40 rounded-full" />
              </span>.
            </h1>

            <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t('landing.heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-gold px-8 py-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-102 transition-transform duration-150">
                  {t('landing.goDashboard')} <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              ) : (
                <>
                  <a href="#courses-showcase" className="btn-gold px-8 py-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-102 transition-transform duration-150">
                    Our Courses <ArrowRight className="w-4 h-4 text-white" />
                  </a>
                  <Link to="/login" className="bg-[#0A2540] hover:bg-[#071A2E] text-white px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-md hover:scale-102 duration-150">
                    {t('landing.complianceLogin')}
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Hero Visual elements with Slide-In */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1], delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-full max-w-[420px]">
              
              {/* Rotating shapes */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -left-10 w-20 h-20 border-2 border-dashed border-[#D4AF37]/30 rounded-full pointer-events-none" 
              />
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -bottom-8 right-6 w-20 h-20 bg-[#0A2540]/10 rounded-full blur-lg pointer-events-none" 
              />

              <div className="relative rounded-lg overflow-hidden border-4 border-[#0A2540] dark:border-[#D4AF37]/45 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
                  alt="Students learning technology"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Glassmorphic overlay card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/80 dark:bg-[#0E2035]/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded p-4 text-slate-800 dark:text-white space-y-1 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">DoIT&C Platform</span>
                  </div>
                  <span className="text-xs font-bold block leading-tight">Rajasthan Technological Training Registry</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Partner Institutions / Marquee Row */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            {language === 'hi' ? "हमारे छात्र इन संगठनों में काम करते हैं" : "OUR ALUMNI & PERSONNEL SERVE IN LEADING SECTORS"}
          </span>
          <div className="flex flex-wrap gap-8 items-center justify-center md:justify-between opacity-70 grayscale hover:grayscale-0 transition-all duration-350">
            <span className="text-xs sm:text-sm font-serif font-bold text-slate-700 dark:text-slate-300">DoIT&C Rajasthan</span>
            <span className="text-xs sm:text-sm font-serif font-bold text-slate-700 dark:text-slate-300">National Informatics Centre</span>
            <span className="text-xs sm:text-sm font-serif font-bold text-slate-700 dark:text-slate-300">Cyber Security Agency</span>
            <span className="text-xs sm:text-sm font-serif font-bold text-slate-700 dark:text-slate-300">State Data Center</span>
            <span className="text-xs sm:text-sm font-serif font-bold text-slate-700 dark:text-slate-300">Jaipur InfoTech Cell</span>
          </div>
        </div>
      </section>

      {/* 3. About Us Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        id="about-us" 
        className="py-24 bg-white dark:bg-[#07172A] border-b border-slate-200 dark:border-slate-800 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* About Image */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] to-[#0A2540] rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <img 
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop" 
              alt="Cyber security command room" 
              className="relative w-full h-[420px] object-cover rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-xl"
            />
          </div>

          {/* About Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] dark:text-[#D4AF37] leading-tight tracking-tight">
              {t('landing.aboutUsHeading')}
            </h2>
            <p className="text-slate-650 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t('landing.aboutUsDesc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0A2540] dark:text-white">{t('landing.continuousCompliance')}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{t('landing.continuousComplianceDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0A2540] dark:text-white">{t('landing.activeVideoRepo')}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{t('landing.activeVideoRepoDesc')}</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <a href="#why-us" className="btn-secondary px-6 py-3 text-xs font-bold uppercase tracking-wider inline-block hover:bg-slate-50 transition-colors">
                {t('landing.aboutUsButton')}
              </a>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 4. Our Courses Showcase Section */}
      <section id="courses-showcase" className="py-24 bg-[#F8FAFC] dark:bg-[#0C1E32]/40 border-b border-slate-200 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] dark:text-white tracking-tight">
                {t('landing.ourCoursesHeading')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                {t('landing.ourCoursesDesc')}
              </p>
            </div>
            <Link to="/blogs" className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              {t('landing.allCoursesButton')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingCourses ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {displayedCourses.map((c, idx) => (
                <motion.div 
                  key={c.id || idx}
                  variants={fadeInUp}
                  className="group premium-card flex flex-col justify-between overflow-hidden bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    
                    {/* Course Thumbnail */}
                    <div className="h-48 relative bg-slate-900 overflow-hidden">
                      <img
                        src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                        alt={c.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-104 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-slate-900/80 text-[#D4AF37] border border-[#D4AF37]/50 rounded-sm">
                        {c.category}
                      </span>
                    </div>

                    {/* Course details */}
                    <div className="px-5 space-y-2 text-left">
                      <div className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{c.estimatedTime || 'Self-paced'}</span>
                        <span>•</span>
                        <span>{c.difficulty || 'All Levels'}</span>
                      </div>
                      
                      <h3 className="text-base font-serif font-bold text-[#0A2540] dark:text-white line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        {c.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {c.description || 'Access state sanctioned educational syllabus with direct metrics monitoring logs.'}
                      </p>
                    </div>

                  </div>

                  <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 mt-5 flex justify-between items-center text-xs font-bold">
                    <span className="text-[#D4AF37] font-mono text-[11px] uppercase tracking-wider">
                      {c.price || 'FREE (GOV)'}
                    </span>
                    <Link
                      to={isAuthenticated ? `/video/${c.id || 1}` : '/login'}
                      className="text-[#0A2540] dark:text-[#D4AF37] hover:underline flex items-center gap-0.5"
                    >
                      {isAuthenticated ? 'Launch Course' : 'Enroll Now'} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* 5. Choose Your Path Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-white dark:bg-[#07172A] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] dark:text-white tracking-tight">
              {t('landing.choosePathTitle')}
            </h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">
              {t('landing.choosePathSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Full Time */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-[#F8FAFC] dark:bg-[#0E2035] space-y-4 text-left shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-[#0A2540] dark:bg-[#D4AF37]/15 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0A2540] dark:text-white">
                  {t('landing.fullTimeTitle')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('landing.fullTimeDesc')}
                </p>
              </div>
              <a href="#about-us" className="btn-secondary py-2 text-xs font-semibold text-center border border-slate-300 dark:border-slate-700 mt-4 block hover:bg-slate-50 transition-colors">
                {t('landing.fullTimeBtn')}
              </a>
            </div>

            {/* Part Time */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-[#F8FAFC] dark:bg-[#0E2035] space-y-4 text-left shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-[#0A2540] dark:bg-[#D4AF37]/15 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0A2540] dark:text-white">
                  {t('landing.partTimeTitle')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('landing.partTimeDesc')}
                </p>
              </div>
              <a href="#about-us" className="btn-secondary py-2 text-xs font-semibold text-center border border-slate-300 dark:border-slate-700 mt-4 block hover:bg-slate-50 transition-colors">
                {t('landing.partTimeBtn')}
              </a>
            </div>

            {/* Online */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-[#F8FAFC] dark:bg-[#0E2035] space-y-4 text-left shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-[#0A2540] dark:bg-[#D4AF37]/15 flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0A2540] dark:text-white">
                  {t('landing.onlineTitle')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('landing.onlineDesc')}
                </p>
              </div>
              <a href="#courses-showcase" className="btn-secondary py-2 text-xs font-semibold text-center border border-slate-300 dark:border-slate-700 mt-4 block hover:bg-slate-50 transition-colors">
                {t('landing.onlineBtn')}
              </a>
            </div>

          </div>

        </div>
      </motion.section>

      {/* 6. Testimonial Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0C1E32]/30 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest block">TESTIMONIALS</span>
          
          <h2 className="text-3xl font-serif font-bold text-[#0A2540] dark:text-white max-w-3xl mx-auto leading-tight tracking-tight">
            {t('landing.testimonialTitle')}
          </h2>

          <p className="text-lg sm:text-xl font-serif italic text-slate-650 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            {t('landing.testimonialQuote')}
          </p>

          <div className="flex flex-col items-center space-y-2.5">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
              alt="Aarav Sharma Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
            />
            <div>
              <span className="font-bold text-slate-800 dark:text-white text-sm block">{t('landing.testimonialAuthor')}</span>
              <span className="text-slate-500 text-xs block">{t('landing.testimonialRole')}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Why Learning With Us Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        id="why-us" 
        className="py-24 bg-white dark:bg-[#07172A] border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] dark:text-white tracking-tight">
              {t('landing.whyUsTitle')}
            </h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm">
              {t('landing.whyUsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="group border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-white dark:bg-[#0E2035] space-y-3 text-left hover-glow hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-10 h-10 rounded bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0A2540] dark:text-white">
                {t('landing.feature1Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feature1Desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-white dark:bg-[#0E2035] space-y-3 text-left hover-glow hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-10 h-10 rounded bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0A2540] dark:text-white">
                {t('landing.feature2Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feature2Desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-white dark:bg-[#0E2035] space-y-3 text-left hover-glow hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-10 h-10 rounded bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0A2540] dark:text-white">
                {t('landing.feature3Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feature3Desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-white dark:bg-[#0E2035] space-y-3 text-left hover-glow hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-10 h-10 rounded bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0A2540] dark:text-white">
                {t('landing.feature4Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feature4Desc')}
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <a href="#courses-showcase" className="btn-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider inline-block">
              Our Courses
            </a>
          </div>

        </div>
      </motion.section>

      {/* 8. Dynamic Articles & Learning Center Feed */}
      <section className="py-24 bg-[#F8FAFC] dark:bg-[#0C1E32]/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] dark:text-white tracking-tight">
                {t('landing.learningCenterTitle')}
              </h2>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-xl">
                {t('landing.learningCenterSubtitle')}
              </p>
            </div>
            <Link
              to="/blogs"
              className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              {t('landing.moreArticlesBtn')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          ) : recentArticles.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {recentArticles.map((art) => (
                <motion.div
                  key={art.id}
                  variants={fadeInUp}
                  className="group flex flex-col justify-between bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 hover:border-[#D4AF37]/50 rounded-md shadow-sm overflow-hidden hover-glow hover:-translate-y-1.5 transition-all duration-300 text-left"
                >
                  <div className="space-y-4">
                    <div className="h-40 relative bg-slate-900 overflow-hidden">
                      <img
                        src={art.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                        alt={art.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-103 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-slate-900/60 text-[#D4AF37] border border-[#D4AF37]/40 rounded-sm">
                        {art.category}
                      </span>
                    </div>

                    <div className="px-5 space-y-2">
                      <div className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                        <span>{art.author?.name || t('blogs.authorAdmin')}</span>
                        <span>•</span>
                        <span>{formatDate(art.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#0A2540] dark:text-white line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                        <Link to={isAuthenticated ? `/blogs/${art.id}` : '/login'}>{art.title}</Link>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-between items-center text-[11px] font-bold">
                    <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.max(1, Math.ceil((art.content?.split(/\s+/).length || 0) / 200))} {t('blogs.minRead')}
                    </span>
                    <Link
                      to={isAuthenticated ? `/blogs/${art.id}` : '/login'}
                      className="text-[#0A2540] dark:text-[#D4AF37] hover:underline flex items-center gap-0.5"
                    >
                      {t('blogs.readArticle')} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 rounded-md">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">{t('landing.noRecentBulletins')}</p>
            </div>
          )}

        </div>
      </section>

      {/* 9. CTA Banner Section */}
      <section className="py-16 bg-white dark:bg-[#07172A] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#0A2540] border-t-4 border-[#D4AF37] rounded-lg p-8 md:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none select-none" />
            
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white max-w-2xl mx-auto tracking-tight">
              {t('landing.growCareerTitle')}
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {t('landing.growCareerSubtitle')}
            </p>
            
            <div className="pt-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-gold px-8 py-3.5 text-xs font-bold uppercase tracking-wider inline-block">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn-gold px-8 py-3.5 text-xs font-bold uppercase tracking-wider inline-block">
                  {t('landing.registerCourses')}
                </Link>
              )}
            </div>

          </motion.div>
        </div>
      </section>

      {/* 10. Upcoming Events Section */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-[#0C1E32]/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] dark:text-white tracking-tight">
                {t('landing.upcomingEventsTitle')}
              </h2>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-xl">
                {t('landing.upcomingEventsSubtitle')}
              </p>
            </div>
            <Link to="/blogs" className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              {t('landing.allEventsBtn')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Event 1 */}
            <div className="group premium-card flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 text-left">
              <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-slate-900 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop"
                  alt="Social media security event"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/50 inline-block">
                    Webinar
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#0A2540] dark:text-white">
                    {t('landing.event1Title')}
                  </h3>
                  
                  <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('landing.eventDate1')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('landing.eventTime')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('landing.eventLocation')}</span>
                    </div>
                  </div>
                </div>
                
                <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-xs font-bold text-[#0A2540] dark:text-[#D4AF37] hover:underline flex items-center gap-0.5">
                  {t('landing.eventDetailsBtn')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Event 2 */}
            <div className="group premium-card flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 text-left">
              <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-slate-900 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop"
                  alt="AI model evaluation workshop"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/50 inline-block">
                    Live Workshop
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#0A2540] dark:text-white">
                    {t('landing.event2Title')}
                  </h3>
                  
                  <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('landing.eventDate2')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('landing.eventTime')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('landing.eventLocation')}</span>
                    </div>
                  </div>
                </div>
                
                <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-xs font-bold text-[#0A2540] dark:text-[#D4AF37] hover:underline flex items-center gap-0.5">
                  {t('landing.eventDetailsBtn')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. Multi-Column Footer */}
      <footer className="border-t border-slate-300 dark:border-slate-800 bg-[#071A2E] py-16 text-white text-xs font-sans text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            {/* Column 1: State Portal Branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/rajasthan_logo.png" 
                  alt={t('common.govEmblemAlt')} 
                  className="w-10 h-10 object-contain bg-white rounded-full p-0.5 border border-[#D4AF37]" 
                />
                <div>
                  <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-wider block">{t('common.statePortal')}</span>
                  <span className="font-serif font-bold tracking-wide text-sm text-white">{t('common.aiCyberHub')}</span>
                </div>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {t('common.compliancedesc')}
              </p>
            </div>

            {/* Column 2: Quick Directory Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">{t('common.adminLinks')}</h4>
              <ul className="space-y-2 text-gray-300 text-[11px]">
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.gazettes')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.rti')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.audit')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('common.quickLinks.accessibility')}</a></li>
              </ul>
            </div>

            {/* Column 3: Helpdesk Contact Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">{t('common.contacts')}</h4>
              <div className="space-y-2 text-gray-300 text-[11px] leading-normal">
                <p><strong>{t('common.supportDesk')}</strong></p>
                <p><strong>{t('common.emailDesk')}</strong></p>
                <p className="text-gray-405">
                  {t('common.address')}
                </p>
              </div>
            </div>

            {/* Column 4: Newsletter Alerts */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">{t('common.bulletins')}</h4>
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

          {/* Sub-links details & Copyright */}
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

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-[#D4AF37] hover:bg-[#C5A059] text-white rounded-full shadow-lg cursor-pointer transition-colors z-40 focus:outline-none"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
