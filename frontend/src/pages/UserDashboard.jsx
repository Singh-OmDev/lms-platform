import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, ChevronRight, Sparkles, Award, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.8, 0.25, 1] } }
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, addToast } = useStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recentAdded, setRecentAdded] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/videos');
        const allVideos = res.data;
        const inProgress = allVideos.filter(v => v.progress && !v.progress.completed && v.progress.completionPercentage > 0);
        const notStarted = allVideos.filter(v => !v.progress || (!v.progress.completed && v.progress.completionPercentage === 0));
        const sortedNewest = [...allVideos].sort((a, b) => b.id - a.id);
        setContinueWatching(inProgress);
        setRecommended(notStarted.slice(0, 3));
        setRecentAdded(sortedNewest.slice(0, 4));
      } catch (err) {
        addToast('Failed to load learning dashboard', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-[#13161E] rounded-2xl border border-[#22283A]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-[#13161E] rounded-2xl border border-[#22283A]" />
          <div className="h-40 bg-[#13161E] rounded-2xl border border-[#22283A]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">

      {/* ── Welcome Banner ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[#22283A] bg-[#13161E]"
        style={{ background: 'linear-gradient(135deg, #13161E 0%, #1A1E2A 50%, #0C0E14 100%)' }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Amber glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#F5A623]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="gov-badge">
              <Zap className="w-2.5 h-2.5" /> {t('dashboard.console')}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
              {t('dashboard.welcome')}, {user?.name?.split(' ')[0] || t('profile.student')} 👋
            </h1>
            <p className="text-[#C2CCDF] text-sm leading-relaxed max-w-lg">{t('dashboard.subtitle')}</p>
          </div>
          <img src="/rajasthan_logo.png" alt="Emblem" className="w-16 h-16 object-contain opacity-15 flex-shrink-0 hidden sm:block" />
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-[#22283A] grid grid-cols-3 divide-x divide-[#22283A]">
          {[
            { label: t('dashboard.inProgress'), value: continueWatching.length },
            { label: t('dashboard.recommended'), value: recommended.length },
            { label: 'New This Week', value: recentAdded.length },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3 text-center">
              <p className="text-xl font-bold text-[#F5A623]" style={{fontFamily:'Fraunces,Georgia,serif'}}>{value}</p>
              <p className="text-[10px] font-mono text-[#8B9ABF] uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Continue Learning ──────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="section-label mb-1">{t('dashboard.continueLearning')}</p>
            <h2 className="text-lg font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{t('dashboard.continueLearning')}</h2>
          </div>
          <span className="badge badge-accent">{continueWatching.length} {t('dashboard.inProgress')}</span>
        </div>

        {continueWatching.length > 0 ? (
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {continueWatching.map((v) => (
              <motion.div key={v.id} variants={fadeUp} className="lms-card overflow-hidden flex flex-col group">
                <div className="p-5 space-y-4 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="badge badge-blue">{v.category}</span>
                      <h3 className="font-bold text-sm text-white line-clamp-1 mt-1" style={{fontFamily:'Fraunces,Georgia,serif'}}>{v.title}</h3>
                    </div>
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-20 h-12 object-cover rounded-lg border border-[#22283A] flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200'; }}
                    />
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#8B9ABF]">
                      <span>{t('dashboard.courseProgress')}</span>
                      <span className="text-[#F5A623] font-medium">{Math.round(v.progress.completionPercentage)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${v.progress.completionPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0C0E14] border-t border-[#22283A] px-5 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8B9ABF] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {v.estimatedTime || '10 mins'}
                  </span>
                  <Link to={`/video/${v.id}`} className="btn-accent py-1.5 px-3 text-[10px] flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-current" /> {t('dashboard.continue')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="lms-card-flat p-10 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-[#22283A] mx-auto" />
            <p className="text-[#C2CCDF] text-sm font-medium">{t('dashboard.noActiveCourses')}</p>
            <p className="text-[#8B9ABF] text-xs">{t('dashboard.catalogPrompt')}</p>
            <Link to="/library" className="btn-ghost inline-flex text-xs py-2 px-5 mt-2">{t('nav.courses')}</Link>
          </div>
        )}
      </div>

      {/* ── Recommended + New Additions ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recommended */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <p className="section-label mb-1">{t('dashboard.recommended')}</p>
            <h2 className="text-base font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{t('dashboard.recommended')}</h2>
          </div>
          <div className="space-y-3">
            {recommended.length > 0 ? recommended.map((v) => (
              <div key={v.id} className="lms-card p-4 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-16 h-10 object-cover rounded-lg border border-[#22283A] flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200'; }}
                  />
                  <div className="min-w-0">
                    <span className="badge badge-blue mb-1">{v.category}</span>
                    <h4 className="text-xs font-bold text-white truncate mt-1" style={{fontFamily:'Fraunces,Georgia,serif'}}>{v.title}</h4>
                    <p className="text-[10px] text-[#8B9ABF] line-clamp-1 mt-0.5">{v.description}</p>
                  </div>
                </div>
                <Link to={`/video/${v.id}`} className="p-2 border border-[#22283A] rounded-lg hover:border-[#F5A623]/40 hover:bg-[#F5A623]/5 text-[#8B9ABF] hover:text-[#F5A623] transition-all flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )) : (
              <div className="lms-card-flat p-6 text-center text-xs text-[#8B9ABF] border-dashed">
                {t('dashboard.allEnrolled')}
              </div>
            )}
          </div>
        </div>

        {/* New Additions */}
        <div className="space-y-4">
          <div>
            <p className="section-label mb-1">Latest</p>
            <h2 className="text-base font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{t('dashboard.newAdditions')}</h2>
          </div>
          <div className="lms-card p-5 space-y-4">
            {recentAdded.map((v, i) => (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                className="flex items-start gap-3 text-xs border-b border-[#22283A] pb-3.5 last:border-0 last:pb-0 group"
              >
                <span className="text-[#F5A623] font-mono font-medium text-[10px] mt-0.5 w-4 flex-shrink-0">
                  {String(i+1).padStart(2,'0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white group-hover:text-[#F5A623] transition-colors truncate text-xs" style={{fontFamily:'Fraunces,Georgia,serif'}}>{v.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#8B9ABF] mt-0.5 uppercase">
                    <span>{v.category}</span>
                    <span>·</span>
                    <span>{v.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
