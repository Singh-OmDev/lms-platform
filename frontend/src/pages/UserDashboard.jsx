import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, ChevronRight, Award, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } }
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
        <div className="h-40 bg-white rounded-xl border border-[#dde3f0]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-white rounded-xl border border-[#dde3f0]" />
          <div className="h-40 bg-white rounded-xl border border-[#dde3f0]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">

      {/* ── Welcome Banner ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d244f] to-[#1a3c8f] text-white"
      >
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute -right-4 -bottom-16 w-80 h-80 bg-[#f4821e]/10 rounded-full" />

        <div className="relative z-10 p-6 md:p-8 flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f4821e]" />
              {t('dashboard.console')}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {t('dashboard.welcome')}, {user?.name?.split(' ')[0] || 'Learner'} 👋
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-lg">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex-shrink-0">
            <Award className="w-8 h-8 text-[#f4821e]" />
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-white/15 grid grid-cols-3 divide-x divide-white/15">
          {[
            { label: t('dashboard.inProgress'),   value: continueWatching.length },
            { label: t('dashboard.recommended'),   value: recommended.length },
            { label: t('dashboard.newAdditions'),  value: recentAdded.length },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3 text-center">
              <p className="text-xl font-bold text-[#f4821e]">{value}</p>
              <p className="text-[10px] font-medium text-white/60 uppercase tracking-wide mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Continue Learning ──────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[12px] font-semibold text-[#f4821e] uppercase tracking-widest mb-1">{t('dashboard.continueLearning')}</p>
            <h2 className="text-[18px] font-bold text-[#1a1a2e]">{t('dashboard.continueLearning')}</h2>
          </div>
          <span className="badge-saffron text-[12px] px-3 py-1 rounded-full bg-[#fff0e5] text-[#f4821e] font-semibold">
            {continueWatching.length} {t('dashboard.inProgress')}
          </span>
        </div>

        {continueWatching.length > 0 ? (
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {continueWatching.map((v) => (
              <motion.div key={v.id} variants={fadeUp} className="lms-card overflow-hidden flex flex-col">
                <div className="p-5 space-y-4 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="badge text-[11px] bg-[#e8edf9] text-[#1a3c8f] px-2 py-0.5 rounded">{v.category}</span>
                      <h3 className="font-bold text-[14px] text-[#1a1a2e] line-clamp-1 mt-1">{v.title}</h3>
                    </div>
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-20 h-12 object-cover rounded-lg border border-[#dde3f0] flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200'; }}
                    />
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-[#5a6a8a]">
                      <span>{t('dashboard.courseProgress')}</span>
                      <span className="text-[#f4821e] font-semibold">{Math.round(v.progress.completionPercentage)}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#f0f2f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a3c8f] rounded-full transition-all" style={{ width: `${v.progress.completionPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f6fb] border-t border-[#dde3f0] px-5 py-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#5a6a8a] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {v.estimatedTime || '10 mins'}
                  </span>
                  <Link to={`/video/${v.id}`} className="btn-primary py-1.5 px-4 text-[12px]">
                    <Play className="w-3 h-3 fill-current" /> {t('dashboard.continue')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="lms-card-flat p-10 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#dde3f0] mx-auto" />
            <p className="text-[#1a1a2e] text-[15px] font-semibold">{t('dashboard.noActiveCourses')}</p>
            <p className="text-[#5a6a8a] text-[13px]">{t('dashboard.catalogPrompt')}</p>
            <Link to="/library" className="btn-outline inline-flex text-[13px] py-2 px-6 mt-2">{t('nav.courses')}</Link>
          </div>
        )}
      </div>

      {/* ── Recommended + New Additions ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recommended */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <p className="text-[12px] font-semibold text-[#f4821e] uppercase tracking-widest mb-1">For You</p>
            <h2 className="text-[18px] font-bold text-[#1a1a2e]">{t('dashboard.recommended')}</h2>
          </div>
          <div className="space-y-3">
            {recommended.length > 0 ? recommended.map((v) => (
              <div key={v.id} className="lms-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-16 h-10 object-cover rounded-lg border border-[#dde3f0] flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200'; }}
                  />
                  <div className="min-w-0">
                    <span className="badge text-[10px] bg-[#e8edf9] text-[#1a3c8f] px-2 py-0.5 rounded mb-1 inline-block">{v.category}</span>
                    <h4 className="text-[13px] font-bold text-[#1a1a2e] truncate">{v.title}</h4>
                    <p className="text-[11px] text-[#5a6a8a] line-clamp-1 mt-0.5">{v.description}</p>
                  </div>
                </div>
                <Link to={`/video/${v.id}`} className="p-2 border border-[#dde3f0] rounded-lg hover:border-[#1a3c8f] hover:bg-[#f0f4ff] text-[#5a6a8a] hover:text-[#1a3c8f] transition-all flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )) : (
              <div className="lms-card-flat p-6 text-center text-[13px] text-[#5a6a8a]">
                {t('dashboard.allEnrolled')}
              </div>
            )}
          </div>
        </div>

        {/* New Additions */}
        <div className="space-y-4">
          <div>
            <p className="text-[12px] font-semibold text-[#f4821e] uppercase tracking-widest mb-1">Latest</p>
            <h2 className="text-[18px] font-bold text-[#1a1a2e]">{t('dashboard.newAdditions')}</h2>
          </div>
          <div className="lms-card p-5 space-y-4">
            {recentAdded.map((v, i) => (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                className="flex items-start gap-3 text-[13px] border-b border-[#dde3f0] pb-3.5 last:border-0 last:pb-0 group"
              >
                <span className="text-[#f4821e] font-bold text-[11px] mt-0.5 w-5 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-[#1a1a2e] group-hover:text-[#1a3c8f] transition-colors truncate text-[13px]">{v.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#5a6a8a] mt-0.5 uppercase">
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
