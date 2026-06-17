import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, X, Menu, ChevronDown, Globe,
  PlayCircle, Award, FileText, Settings, Users, BookOpen,
  Monitor, Shield, Brain, Cloud, Database, BarChart2,
  CheckCircle, Star, ChevronRight, Phone, Mail, MapPin,
  TrendingUp, Cpu, Lock
} from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

/* ── Sector categories (Skill India Digital style) ────────── */
const SECTORS = [
  { icon: Monitor,   label: 'IT & Software',     color: '#1a3c8f' },
  { icon: Brain,     label: 'Artificial Intelligence', color: '#7c3aed' },
  { icon: Shield,    label: 'Cybersecurity',      color: '#c0392b' },
  { icon: Cloud,     label: 'Cloud Computing',    color: '#0ea5e9' },
  { icon: Database,  label: 'Data Science',       color: '#138808' },
  { icon: BarChart2, label: 'Management',          color: '#f4821e' },
  { icon: BookOpen,  label: 'E-Governance',        color: '#1a3c8f' },
  { icon: Cpu,       label: 'Digital Literacy',   color: '#7c3aed' },
  { icon: TrendingUp,label: 'Finance & Accounts', color: '#138808' },
  { icon: Lock,      label: 'Compliance & Law',   color: '#c0392b' },
  { icon: Users,     label: 'Leadership',          color: '#f4821e' },
  { icon: Globe,     label: 'Languages',           color: '#0ea5e9' },
];

/* ── Static fallback courses ──────────────────────────────── */
const STATIC_COURSES = [
  {
    id: 'ai-gov',
    title: 'Generative AI for Government Officers',
    instructor: 'Dr. Alok Sharma',
    category: 'Artificial Intelligence',
    rating: 4.8,
    students: 3200,
    duration: '6 weeks',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'cyber-essentials',
    title: 'Cybersecurity Essentials for Civil Servants',
    instructor: 'Priya Verma, CISA',
    category: 'Cybersecurity',
    rating: 4.9,
    students: 5100,
    duration: '4 weeks',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'cloud-gov',
    title: 'Cloud Infrastructure for State Departments',
    instructor: 'Manish Singh',
    category: 'Cloud Computing',
    rating: 4.7,
    students: 2800,
    duration: '8 weeks',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis for Policy Making',
    instructor: 'Dr. Kavita Mehra',
    category: 'Data Science',
    rating: 4.6,
    students: 1900,
    duration: '5 weeks',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  },
];

/* ── Star rating ───────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-[#f4821e] text-[#f4821e]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

/* ── Course Card ───────────────────────────────────────────── */
function CourseCard({ course, to }) {
  return (
    <Link to={to}>
      <div className="lms-card flex flex-col h-full overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-[12px]">
          <img
            src={course.thumbnail || course.thumbnailUrl || course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="badge-blue text-[11px] px-2 py-1 rounded-[4px] font-semibold bg-[#1a3c8f] text-white">
              {course.category || 'Technology'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-[15px] font-semibold text-[#1a1a2e] leading-snug mb-2 line-clamp-2 flex-1">
            {course.title}
          </h3>
          <p className="text-[13px] text-[#5a6a8a] mb-3">
            {course.instructor || course.author || 'DoIT&C Instructor'}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[13px] font-bold text-[#f4821e]">{course.rating || '4.7'}</span>
            <Stars rating={course.rating || 4.7} />
            <span className="text-[12px] text-[#9aaed0]">
              ({(course.students || 0).toLocaleString?.() || course.students || '1,200'})
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#dde3f0]">
            <span className="text-[12px] text-[#5a6a8a] flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5" />
              {course.duration || '4 weeks'}
            </span>
            <span className="text-[13px] font-bold text-[#138808]">Free</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const { isAuthenticated, user } = useStore();
  const [courses, setCourses] = useState([]);
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes] = await Promise.all([api.get('/articles')]);
        setArticles(artRes.data.slice(0, 3));
      } catch { /* silent */ }

      if (isAuthenticated) {
        try {
          const vidRes = await api.get('/videos');
          setCourses(vidRes.data.slice(0, 4));
        } catch { /* silent */ }
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const displayedCourses = courses.length > 0 ? courses : STATIC_COURSES;

  return (
    <div className="bg-[#f4f6fb] text-[#1a1a2e] min-h-screen font-sans">

      {/* ══════════════════════════════════════════════════════
          TOP ACCESSIBILITY BAR  (iLearn style)
      ══════════════════════════════════════════════════════ */}
      <div className="bg-[#0d244f] text-white text-[12px] py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="opacity-70">Screen Reader Access</span>
          <span className="opacity-30">|</span>
          <a href="#main" className="opacity-70 hover:opacity-100 transition-opacity">Skip to Main Content</a>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-70">A-</span>
          <span className="opacity-70 cursor-default">A</span>
          <span className="opacity-70">A+</span>
          <span className="opacity-30">|</span>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Globe className="w-3 h-3" />
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          NAVIGATION BAR  (Skill India Digital style)
      ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#dde3f0] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#1a3c8f] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">सु</span>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-[#1a3c8f]">Suraksha.AI</div>
              <div className="text-[10px] text-[#5a6a8a] font-medium">Government of Rajasthan</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {[
              { label: 'Home', to: '/' },
              { label: 'Courses', to: '/dashboard' },
              { label: 'Blogs', to: '/blogs' },
              { label: 'Certifications', to: '/certificates' },
              ...(isAuthenticated && user?.role === 'admin' ? [{ label: 'Admin', to: '/admin/dashboard' }] : []),
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-[14px] font-medium text-[#1a1a2e] rounded-md hover:text-[#1a3c8f] hover:bg-[#f0f4ff] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-[14px] px-5 py-2.5">
                My Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[14px] font-semibold text-[#1a3c8f] hover:underline px-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-[14px] px-5 py-2.5">
                  Register Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="lg:hidden text-[#1a3c8f]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-[#dde3f0] overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-2">
                <Link to="/" className="py-2 text-[15px] font-medium text-[#1a1a2e] border-b border-[#f0f2f7]">Home</Link>
                <Link to="/dashboard" className="py-2 text-[15px] font-medium text-[#1a1a2e] border-b border-[#f0f2f7]">Courses</Link>
                <Link to="/blogs" className="py-2 text-[15px] font-medium text-[#1a1a2e] border-b border-[#f0f2f7]">Blogs</Link>
                <Link to="/certificates" className="py-2 text-[15px] font-medium text-[#1a1a2e] border-b border-[#f0f2f7]">Certifications</Link>
                <div className="flex gap-3 mt-3">
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="btn-primary flex-1 justify-center">My Dashboard</Link>
                  ) : (
                    <>
                      <Link to="/login" className="btn-outline flex-1 justify-center">Log in</Link>
                      <Link to="/register" className="btn-primary flex-1 justify-center">Register</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO BANNER  (iLearn full-width style)
      ══════════════════════════════════════════════════════ */}
      <section id="main" className="relative w-full min-h-[480px] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero_banner.png')" }}
        />
        {/* Dark navy overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d244f]/90 via-[#1a3c8f]/75 to-[#0d244f]/40" />

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#f4821e]" />
              <span className="text-white text-[12px] font-semibold tracking-wide uppercase">
                Official E-Learning Portal · DoIT&C Rajasthan
              </span>
            </div>

            <h1 className="text-[clamp(28px,5vw,52px)] font-bold text-white leading-[1.2] mb-4">
              Skill Up. Serve Better.<br />
              <span className="text-[#f4821e]">Lead the Digital India.</span>
            </h1>

            <p className="text-[16px] text-white/85 leading-relaxed mb-8 max-w-lg">
              Free professional courses for government officers and citizens. Earn verified credentials from the Department of IT & Communication.
            </p>

            {/* Search bar */}
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-xl max-w-xl">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-[#9aaed0] flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search courses, topics, skills..."
                  className="flex-1 text-[15px] text-[#1a1a2e] outline-none bg-transparent placeholder:text-[#9aaed0]"
                />
              </div>
              <Link
                to={`/dashboard${searchQuery ? `?q=${searchQuery}` : ''}`}
                className="btn-primary rounded-md px-6 py-2.5 text-[14px]"
              >
                Search
              </Link>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Cybersecurity', 'AI & ML', 'Cloud', 'Data Analytics', 'E-Governance'].map(tag => (
                <Link key={tag} to="/dashboard" className="text-[12px] text-white/80 hover:text-white border border-white/30 hover:border-white/60 rounded-full px-3 py-1 transition-all">
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════
          STATS BAND  (Skill India Mission style)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#1a3c8f] py-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            {[
              { value: '15,000+', label: 'Registered Learners', icon: Users },
              { value: '120+',    label: 'Expert-Led Courses',  icon: BookOpen },
              { value: '8,500+', label: 'Certificates Issued', icon: Award },
              { value: '98%',    label: 'Learner Satisfaction', icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6 text-[#f4821e]" />
                </div>
                <div className="text-[32px] font-bold leading-none">{value}</div>
                <div className="text-[13px] text-white/70 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPLORE BY SECTOR  (Skill India Digital style)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[13px] font-semibold text-[#f4821e] uppercase tracking-widest mb-2">Browse by Sector</p>
              <h2 className="text-[28px] font-bold text-[#1a1a2e]">Explore Learning Sectors</h2>
              <p className="text-[15px] text-[#5a6a8a] mt-1">Choose from 12 professional learning tracks</p>
            </div>
            <Link to="/dashboard" className="hidden md:flex items-center gap-1 text-[14px] font-semibold text-[#1a3c8f] hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sector grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {SECTORS.map(({ icon: Icon, label, color }) => (
              <Link to="/dashboard" key={label}>
                <div className="sector-tile group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-6 h-6 sector-icon transition-colors" style={{ color }} />
                  </div>
                  <span className="sector-label text-[12px] font-semibold text-[#1a1a2e] text-center leading-tight transition-colors">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED COURSES GRID  (iLearn card style)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#f4f6fb]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[13px] font-semibold text-[#f4821e] uppercase tracking-widest mb-2">Featured Courses</p>
              <h2 className="text-[28px] font-bold text-[#1a1a2e]">Start Learning Today</h2>
              <p className="text-[15px] text-[#5a6a8a] mt-1">All courses are free and certified by DoIT&C</p>
            </div>
            <Link to="/dashboard" className="hidden md:flex items-center gap-1 text-[14px] font-semibold text-[#1a3c8f] hover:underline">
              All courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedCourses.map(course => (
              <motion.div
                key={course.id || course._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <CourseCard
                  course={course}
                  to={isAuthenticated ? '/dashboard' : '/login'}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US  (Skill India Mission style)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[13px] font-semibold text-[#f4821e] uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-[28px] font-bold text-[#1a1a2e]">Built for Government Professionals</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Government-Verified Certificates',
                body: 'All certificates are officially issued by DoIT&C, Government of Rajasthan — recognised across all state departments.',
                color: '#1a3c8f',
              },
              {
                icon: PlayCircle,
                title: 'On-Demand Video Learning',
                body: 'Learn at your own pace with high-quality video lectures recorded by domain experts from leading institutions.',
                color: '#f4821e',
              },
              {
                icon: Shield,
                title: 'Secure & Accessible',
                body: 'Built on government-grade infrastructure. Accessible from any device, with full support for assistive technologies.',
                color: '#138808',
              },
              {
                icon: Globe,
                title: 'Bilingual Content',
                body: 'Courses available in both English and Hindi. Switch languages instantly from the navigation bar.',
                color: '#7c3aed',
              },
              {
                icon: Users,
                title: 'Community of Learners',
                body: 'Join 15,000+ government officers and citizens already upgrading their skills on this platform.',
                color: '#f4821e',
              },
              {
                icon: TrendingUp,
                title: '100% Free Access',
                body: 'Every course, every certificate — completely free. No subscription, no hidden fees, ever.',
                color: '#1a3c8f',
              },
            ].map(({ icon: Icon, title, body, color }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 p-6 bg-[#f4f6fb] rounded-xl border border-[#dde3f0] hover:border-[#1a3c8f] hover:shadow-md transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a1a2e] mb-2">{title}</h3>
                  <p className="text-[14px] text-[#5a6a8a] leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          LATEST BLOGS / ARTICLES
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#f4f6fb]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[13px] font-semibold text-[#f4821e] uppercase tracking-widest mb-2">Knowledge Hub</p>
              <h2 className="text-[28px] font-bold text-[#1a1a2e]">Latest Articles & Blogs</h2>
            </div>
            <Link to="/blogs" className="hidden md:flex items-center gap-1 text-[14px] font-semibold text-[#1a3c8f] hover:underline">
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(articles.length > 0 ? articles : [
              { title: 'Best Practices for Cybersecurity in Government Systems', category: 'Security', author: { name: 'Priya Verma' }, createdAt: '2026-06-10' },
              { title: 'How AI is Transforming Public Service Delivery in India', category: 'AI & Innovation', author: { name: 'Dr. A. Sharma' }, createdAt: '2026-06-08' },
              { title: 'Introduction to Cloud Computing for State Government Officers', category: 'Cloud', author: { name: 'Manish Singh' }, createdAt: '2026-06-05' },
            ]).map((art, i) => (
              <Link key={i} to="/blogs" className="block">
                <div className="lms-card overflow-hidden flex flex-col h-full">
                  <div className="h-2 bg-[#1a3c8f]" />
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#f4821e] uppercase tracking-wide mb-3">
                      <FileText className="w-3.5 h-3.5" />
                      {art.category || 'Government'}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#1a1a2e] leading-snug mb-4 flex-1 line-clamp-3">
                      {art.title}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-[#dde3f0] mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1a3c8f] flex items-center justify-center text-[11px] font-bold text-white">
                          {(art.author?.name || 'DA').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[12px] text-[#5a6a8a] font-medium">{art.author?.name || 'DoIT&C'}</span>
                      </div>
                      <span className="text-[12px] text-[#5a6a8a]">
                        {art.createdAt ? new Date(art.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Jun 2026'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CERTIFICATE CTA BAND
      ══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#0d244f] to-[#1a3c8f] py-16">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-10 justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-[13px] font-semibold text-[#f4821e] uppercase tracking-widest mb-3">Certifications</p>
            <h2 className="text-[32px] font-bold text-white leading-[1.25] mb-4">
              Earn Certificates That Matter
            </h2>
            <p className="text-[15px] text-white/75 leading-relaxed">
              Complete any course and earn a government-verified digital certificate. Share it on professional networks or download as PDF. Your achievement, officially recognised.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
              <Link to={isAuthenticated ? '/certificates' : '/register'} className="btn-primary text-[15px]">
                Get Certified <Award className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="btn-outline border-white text-white hover:bg-white hover:text-[#1a3c8f] text-[15px]">
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Certificate mockup */}
          <div className="flex-shrink-0 w-full max-w-[340px]">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-[#f4821e]/30">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#dde3f0]">
                <div className="w-12 h-12 rounded-lg bg-[#1a3c8f] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">सु</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#5a6a8a] uppercase tracking-wide">Certificate of Completion</div>
                  <div className="text-[13px] font-bold text-[#1a1a2e]">Suraksha.AI Platform</div>
                </div>
              </div>
              <div className="text-center py-3">
                <div className="text-[11px] text-[#5a6a8a] mb-1">This certifies that</div>
                <div className="text-[16px] font-bold text-[#1a3c8f] mb-3">Rajesh Kumar Sharma</div>
                <div className="text-[11px] text-[#5a6a8a] mb-1">has successfully completed</div>
                <div className="text-[14px] font-bold text-[#1a1a2e] mb-4">Cybersecurity Fundamentals</div>
                <div className="flex items-center justify-center gap-2 text-[#138808]">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-[12px] font-semibold">Verified by Government of Rajasthan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER  (iLearn gov style)
      ══════════════════════════════════════════════════════ */}
      <footer className="bg-[#0d244f] text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand col */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">सु</span>
                </div>
                <div>
                  <div className="text-[15px] font-bold">Suraksha.AI</div>
                  <div className="text-[11px] text-white/60">Government of Rajasthan</div>
                </div>
              </div>
              <p className="text-[13px] text-white/60 leading-relaxed mb-4">
                Official e-learning portal of the Department of Information Technology & Communication, Government of Rajasthan.
              </p>
              <div className="flex items-center gap-2 text-[12px] text-white/50">
                <div className="w-4 h-2.5 flex flex-col justify-between">
                  <div className="h-0.5 bg-[#f4821e]" />
                  <div className="h-0.5 bg-white" />
                  <div className="h-0.5 bg-[#138808]" />
                </div>
                <span>India</span>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-white/50 mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Browse Courses', to: '/dashboard' },
                  { label: 'My Dashboard', to: '/dashboard' },
                  { label: 'Read Blogs', to: '/blogs' },
                  { label: 'My Certificates', to: '/certificates' },
                  ...(isAuthenticated && user?.role === 'admin' ? [{ label: 'Admin Panel', to: '/admin/dashboard' }] : []),
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[14px] text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account links */}
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-white/50 mb-4">Account</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Login', to: '/login' },
                  { label: 'Register', to: '/register' },
                  { label: 'My Profile', to: '/profile' },
                  { label: 'Reset Password', to: '/forgot-password' },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[14px] text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-white/50 mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-[13px] text-white/60">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#f4821e]" />
                  DoIT&C, Yojana Bhawan, Tilak Marg, Jaipur – 302005
                </li>
                <li className="flex items-center gap-2.5 text-[13px] text-white/60">
                  <Phone className="w-4 h-4 flex-shrink-0 text-[#f4821e]" />
                  0141-2226073
                </li>
                <li className="flex items-center gap-2.5 text-[13px] text-white/60">
                  <Mail className="w-4 h-4 flex-shrink-0 text-[#f4821e]" />
                  support.doitc@rajasthan.gov.in
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-white/40">
            <p>© 2026 Department of IT & Communication, Government of Rajasthan. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/70 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/70 transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white/70 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
