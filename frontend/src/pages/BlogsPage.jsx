import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, User, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function BlogsPage() {
  const { addToast } = useStore();
  const { t, language } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Handle simple debounce for instant search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {};
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        const res = await api.get('/articles', { params });
        setArticles(res.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        addToast('Failed to retrieve compliance articles', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, debouncedSearch, addToast]);

  const categories = ['All', 'AI', 'Cybersecurity', 'General'];

  // Split featured article from the grid list
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'ai':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/45';
      case 'cybersecurity':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/45';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/45';
    }
  };

  // Estimate reading time if not saved (assumes 200 words per minute)
  const estimateReadTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} ${t('blogs.minRead')}`;
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-[#2d3748]">
      
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[#0A2540] to-[#123E66] text-white p-6 md:p-8 shadow-md border-b-4 border-[#D4AF37]">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-sm w-fit border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> {t('blogs.intelligencePortal')}
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight">
            {t('blogs.title')}
          </h1>
          <p className="text-neutral-200 text-xs md:text-sm font-medium leading-relaxed">
            {t('blogs.subtitle')}
          </p>
        </div>
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-25 dark:opacity-40 select-none pointer-events-none hidden md:block">
          <img src="/rajasthan_logo.png" alt="Emblem" className="w-48 h-48 object-contain" />
        </div>
      </div>

      {/* Filters & Search bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-gray-200 p-4 rounded-md shadow-sm">
        {/* Category Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {cat === 'All' ? t('blogs.allPublications') : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('blogs.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-md text-xs outline-none focus:border-[#0A2540] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-64 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-60 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
            <div className="h-60 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
            <div className="h-60 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-md shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">{t('blogs.noPublications')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {t('blogs.noPublicationsDesc')}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Article Hero */}
          {featuredArticle && (
            <div className="group overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-52 sm:h-72 lg:h-auto relative overflow-hidden bg-slate-900">
                <img
                  src={featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
                />
                <span className={`absolute top-4 left-4 px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded-md border shadow-sm ${getCategoryColor(featuredArticle.category)}`}>
                  {featuredArticle.category}
                </span>
              </div>
              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {featuredArticle.author?.name || t('blogs.authorAdmin')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(featuredArticle.createdAt)}
                    </span>
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-serif font-bold text-[#0A2540] leading-snug group-hover:text-[#0b48a0] transition-colors">
                    <Link to={`/blogs/${featuredArticle.id}`}>{featuredArticle.title}</Link>
                  </h2>
                  
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {featuredArticle.summary}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-150 pt-4">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {estimateReadTime(featuredArticle.content)}
                  </span>
                  
                  <Link
                    to={`/blogs/${featuredArticle.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2540] hover:text-[#0b48a0] group/btn"
                  >
                    {t('blogs.readArticle')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of other articles */}
          {gridArticles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider border-b border-gray-200 pb-2">
                {t('blogs.recentPublications')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article) => (
                  <div
                    key={article.id}
                    className="group flex flex-col justify-between bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Image Container */}
                      <div className="h-44 relative bg-slate-900 overflow-hidden">
                        <img
                          src={article.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                          alt={article.title}
                          className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-550"
                        />
                        <span className={`absolute top-3 left-3 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm border shadow-sm ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="px-5 pb-2 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[9px] text-gray-500 font-bold">
                          <span className="flex items-center gap-0.5 truncate max-w-[100px]">
                            <User className="w-3 h-3 text-gray-400" />
                            {article.author?.name || t('blogs.authorAdmin')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {formatDate(article.createdAt)}
                          </span>
                        </div>

                        <h4 className="text-sm font-serif font-bold text-[#0A2540] leading-snug group-hover:text-[#0b48a0] transition-colors line-clamp-2">
                          <Link to={`/blogs/${article.id}`}>{article.title}</Link>
                        </h4>

                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between mt-4">
                      <span className="text-[9px] text-gray-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {estimateReadTime(article.content)}
                      </span>
                      
                      <Link
                        to={`/blogs/${article.id}`}
                        className="inline-flex items-center gap-0.5 text-xs font-bold text-[#0A2540] hover:text-[#0b48a0]"
                      >
                        {t('blogs.read')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
