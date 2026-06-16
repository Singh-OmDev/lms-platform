import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, User, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } }
};

export default function BlogsPage() {
  const { addToast } = useStore();
  const { t, language } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        const res = await api.get('/articles', { params });
        setArticles(res.data);
      } catch {
        addToast('Failed to retrieve compliance articles', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [activeCategory, debouncedSearch, addToast]);

  const categories = ['All', 'AI', 'Cybersecurity', 'General'];
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  const formatDate = (d) => new Date(d).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const getCategoryBadge = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'ai': return 'badge badge-blue';
      case 'cybersecurity': return 'badge badge-purple';
      default: return 'badge badge-accent';
    }
  };

  const estimateReadTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    return `${Math.max(1, Math.ceil(words / 200))} ${t('blogs.minRead')}`;
  };

  return (
    <div className="space-y-8 pb-16">

      {/* ── Page header ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-[#22283A]"
        style={{ background: 'linear-gradient(135deg, #13161E 0%, #1A1E2A 60%, #0C0E14 100%)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute right-0 top-0 w-56 h-56 bg-[#60A5FA]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 space-y-3">
          <div className="gov-badge">
            <Sparkles className="w-2.5 h-2.5" /> {t('blogs.intelligencePortal')}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>
            {t('blogs.title')}
          </h1>
          <p className="text-[#C2CCDF] text-sm leading-relaxed max-w-xl">{t('blogs.subtitle')}</p>
        </div>
        <img src="/rajasthan_logo.png" alt="Emblem" className="absolute right-6 bottom-0 translate-y-4 w-28 h-28 object-contain opacity-5 pointer-events-none hidden md:block" />
      </motion.div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#13161E] border border-[#22283A] p-4 rounded-2xl">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-[#F5A623] text-[#0C0E14] font-bold border-[#F5A623]'
                  : 'bg-transparent text-[#C2CCDF] border-[#22283A] hover:border-[#2E3650] hover:text-white'
              }`}
            >
              {cat === 'All' ? t('blogs.allPublications') : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="w-3.5 h-3.5 text-[#8B9ABF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('blogs.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0C0E14] border border-[#22283A] rounded-xl text-sm text-white placeholder-[#8B9ABF] outline-none focus:border-[#F5A623] transition-colors"
          />
        </div>
      </div>

      {/* ── Content ────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-72 bg-[#13161E] rounded-2xl border border-[#22283A]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-56 bg-[#13161E] rounded-2xl border border-[#22283A]" />)}
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="lms-card p-16 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#22283A] mx-auto" />
          <h3 className="text-base font-bold text-white" style={{fontFamily:'Fraunces,Georgia,serif'}}>{t('blogs.noPublications')}</h3>
          <p className="text-xs text-[#8B9ABF]">{t('blogs.noPublicationsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Featured */}
          {featuredArticle && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lms-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 group"
            >
              <div className="lg:col-span-7 h-52 sm:h-72 lg:h-auto relative bg-[#0C0E14] overflow-hidden">
                <img
                  src={featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600'}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#13161E]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13161E] via-transparent to-transparent" />
                <span className={`absolute top-4 left-4 ${getCategoryBadge(featuredArticle.category)}`}>{featuredArticle.category}</span>
              </div>

              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[#8B9ABF]">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{featuredArticle.author?.name || t('blogs.authorAdmin')}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(featuredArticle.createdAt)}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-[#F5A623] transition-colors" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                    <Link to={`/blogs/${featuredArticle.id}`}>{featuredArticle.title}</Link>
                  </h2>
                  <p className="text-sm text-[#C2CCDF] leading-relaxed line-clamp-3">{featuredArticle.summary}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#22283A]">
                  <span className="text-[10px] font-mono text-[#8B9ABF] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {estimateReadTime(featuredArticle.content)}
                  </span>
                  <Link to={`/blogs/${featuredArticle.id}`} className="flex items-center gap-1 text-xs font-bold text-[#F5A623] hover:text-[#FFBA45] transition-colors group/btn">
                    {t('blogs.readArticle')} <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          {gridArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="accent-rule" />
                <h3 className="section-label">{t('blogs.recentPublications')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridArticles.map((article) => (
                  <div key={article.id} className="lms-card flex flex-col overflow-hidden group">
                    <div className="h-40 relative bg-[#0C0E14] overflow-hidden">
                      <img
                        src={article.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600'}
                        alt={article.title}
                        className="w-full h-full object-cover opacity-55 group-hover:opacity-80 group-hover:scale-105 transition-all duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#13161E] via-transparent to-transparent" />
                      <span className={`absolute top-3 left-3 ${getCategoryBadge(article.category)}`}>{article.category}</span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-[9px] font-mono text-[#8B9ABF]">
                        <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" />{article.author?.name || t('blogs.authorAdmin')}</span>
                        <span>·</span>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#F5A623] transition-colors line-clamp-2 flex-1 leading-snug" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                        <Link to={`/blogs/${article.id}`}>{article.title}</Link>
                      </h4>
                      <p className="text-xs text-[#8B9ABF] line-clamp-2 leading-relaxed">{article.summary}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-[#22283A] mt-auto">
                        <span className="text-[9px] font-mono text-[#8B9ABF] flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{estimateReadTime(article.content)}</span>
                        <Link to={`/blogs/${article.id}`} className="flex items-center gap-0.5 text-xs font-bold text-[#F5A623] hover:text-[#FFBA45] transition-colors">
                          {t('blogs.read')} <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
