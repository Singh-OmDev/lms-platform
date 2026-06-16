import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Play, CheckCircle, FolderOpen, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] } }
};

const SELECT_CLS = `
  bg-white border border-[#dde3f0] rounded-xl px-3 py-2 text-xs font-semibold
  text-[#1a3c8f] outline-none focus:border-[#1a3c8f] transition-colors cursor-pointer
  appearance-none pr-7
`;

export default function VideoLibrary() {
  const { addToast } = useStore();
  const { t } = useTranslation();
  const [videos, setVideos]             = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus]     = useState('All');
  const [sortBy, setSortBy]             = useState('Default');
  const [viewMode, setViewMode]         = useState('grid');

  useEffect(() => {
    api.get('/videos/categories')
      .then(r => setCategories(['All', ...r.data.map(c => c.name)]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const t_ = setTimeout(async () => {
      try {
        setLoading(true);
        const params = {};
        if (search)                      params.search   = search;
        if (selectedCategory !== 'All')  params.category = selectedCategory;
        if (selectedStatus   !== 'All')  params.status   = selectedStatus;
        if (sortBy           !== 'Default') params.sortBy = sortBy;
        const res = await api.get('/videos', { params });
        setVideos(res.data);
      } catch {
        addToast('Failed to retrieve video catalog', 'danger');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t_);
  }, [search, selectedCategory, selectedStatus, sortBy]);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const getCategoryBadge = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'artificial intelligence':
      case 'ai': return 'badge badge-blue';
      case 'cybersecurity':
      case 'cyber security': return 'badge badge-purple';
      default: return 'badge badge-accent';
    }
  };

  const getDifficultyBadge = (d) => {
    switch (d?.toLowerCase()) {
      case 'beginner': return 'badge badge-green';
      case 'advanced':
      case 'expert':   return 'badge badge-red';
      default:         return 'badge badge-accent';
    }
  };

  return (
    <div className="space-y-8 pb-16">

      {/* ── Page header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-1"
      >
        <p className="section-label">{t('nav.courses')}</p>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">
          {t('catalog.title')}
        </h1>
        <p className="text-[#5a6a8a] text-sm">{t('catalog.subtitle')}</p>
      </motion.div>

      {/* ── Filter bar ───────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between p-4 rounded-2xl border border-[#dde3f0] bg-white shadow-sm">

        {/* Search */}
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6a8a] w-3.5 h-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder={t('catalog.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dde3f0] rounded-xl text-sm text-[#1a1a2e] placeholder-[#9aaed0] outline-none focus:border-[#1a3c8f] transition-colors"
          />
        </div>

        {/* Filters + view toggles */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-semibold text-[#5a6a8a] uppercase tracking-widest whitespace-nowrap">
              {t('catalog.domain')}
            </span>
            <div className="relative">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className={SELECT_CLS}>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-white text-[#1a1a2e]">
                    {cat === 'All' ? 'All Domains' : cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a3c8f]">▾</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-semibold text-[#5a6a8a] uppercase tracking-widest whitespace-nowrap">
              {t('catalog.status')}
            </span>
            <div className="relative">
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className={SELECT_CLS}>
                <option value="All"         className="bg-white text-[#1a1a2e]">{t('catalog.allProgress')}</option>
                <option value="In Progress" className="bg-white text-[#1a1a2e]">{t('catalog.inProgress')}</option>
                <option value="Completed"   className="bg-white text-[#1a1a2e]">{t('catalog.completed')}</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a3c8f]">▾</div>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-semibold text-[#5a6a8a] uppercase tracking-widest whitespace-nowrap">
              {t('catalog.sort')}
            </span>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={SELECT_CLS}>
                <option value="Default" className="bg-white text-[#1a1a2e]">{t('catalog.sortDefault')}</option>
                <option value="Newest"  className="bg-white text-[#1a1a2e]">{t('catalog.sortNewest')}</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a3c8f]">▾</div>
            </div>
          </div>

          {/* View mode */}
          <div className="flex items-center bg-[#f4f6fb] border border-[#dde3f0] rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#f4821e] text-white' : 'text-[#5a6a8a] hover:text-[#1a3c8f]'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-[#f4821e] text-white' : 'text-[#5a6a8a] hover:text-[#1a3c8f]'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Count chip */}
          {!loading && (
            <span className="badge badge-accent">{videos.length} {t('catalog.courses') || 'courses'}</span>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-[#dde3f0] rounded-2xl animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-2xl" />
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="h-4 w-20 bg-gray-200 rounded-full" />
                  <div className="h-4 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'space-y-4'
          }
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              variants={fadeUp}
              className={`
                lms-card overflow-hidden flex
                ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center gap-0'}
              `}
            >
              {/* Thumbnail */}
              <div className={`
                relative bg-[#f4f6fb] flex-shrink-0 overflow-hidden group/thumb
                ${viewMode === 'grid' ? 'aspect-video w-full' : 'w-40 h-full min-h-[90px] rounded-l-2xl'}
              `}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-all duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600'; }}
                />
                {/* Duration chip */}
                <span className="absolute bottom-2 right-2 bg-[#1a1a2e]/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-mono text-white border border-white/10 select-none">
                  {fmt(video.duration)}
                </span>
                {/* Play overlay */}
                <Link
                  to={`/video/${video.id}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/20"
                >
                  <div className="w-11 h-11 rounded-full bg-[#f4821e] text-white flex items-center justify-center shadow-lg shadow-[#f4821e]/30 hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </Link>
                {/* Completed ribbon */}
                {video.progress?.completed && (
                  <div className="absolute top-2 left-2">
                    <span className="badge badge-green"><CheckCircle className="w-2.5 h-2.5" /> Done</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`flex flex-col justify-between flex-1 ${viewMode === 'grid' ? 'p-5 space-y-4' : 'p-4 space-y-3'}`}>
                <div className="space-y-2.5">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={getCategoryBadge(video.category)}>{video.category}</span>
                    <span className={getDifficultyBadge(video.difficulty)}>{video.difficulty}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold text-sm text-[#1a1a2e] line-clamp-2 leading-snug group-hover:text-[#1a3c8f] transition-colors"
                  >
                    {video.title}
                  </h3>

                  {/* Desc */}
                  {viewMode === 'grid' && (
                    <p className="text-xs text-[#5a6a8a] line-clamp-2 leading-relaxed">{video.description}</p>
                  )}
                </div>

                {/* Progress + CTA */}
                <div className="space-y-3 pt-1">
                  {video.progress && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-[#5a6a8a]">
                        <span>{t('video.completion')}</span>
                        <span className="text-[#f4821e] font-bold">{Math.round(video.progress.completionPercentage)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${video.progress.completionPercentage}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <Link
                      to={`/video/${video.id}`}
                      className="btn-accent py-1.5 px-4 text-[10px] flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5" />
                      {video.progress?.completed
                        ? t('catalog.reviewLesson')
                        : video.progress?.currentTime > 0
                          ? t('catalog.resumeLesson')
                          : t('catalog.launchCourse')}
                    </Link>

                    {/* Duration meta */}
                    {video.estimatedTime && (
                      <span className="text-[9px] font-semibold text-[#5a6a8a] flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5" /> {video.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty state */
        <div className="lms-card p-16 text-center space-y-3 max-w-md mx-auto bg-white">
          <FolderOpen className="w-10 h-10 text-[#5a6a8a] mx-auto" />
          <h3 className="font-bold text-base text-[#1a1a2e]">
            {t('catalog.noCourses')}
          </h3>
          <p className="text-sm text-[#5a6a8a] max-w-xs mx-auto leading-relaxed">
            {t('catalog.noCoursesDesc')}
          </p>
        </div>
      )}
    </div>
  );
}
