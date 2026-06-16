import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, Shield, BookOpen } from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function ArticleReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useStore();
  const { t, language } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch {
        addToast('Article not found or access restricted', 'danger');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate, addToast]);

  const formatDate = (d) => new Date(d).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast(t('blogs.linkCopied'), 'success');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-64 bg-white rounded-2xl border border-[#dde3f0]" />
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-3xl mx-auto py-4 pb-20">

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/blogs" className="flex items-center gap-1.5 text-xs font-bold text-[#1a3c8f] hover:text-[#f4821e] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {t('blogs.backToPublications')}
        </Link>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#dde3f0] hover:border-[#1a3c8f] text-[#1a3c8f] font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          {t('blogs.shareArticle')}
        </button>
      </div>

      {/* ── Main article ─────────────────────────────────── */}
      <article className="lms-card-flat overflow-hidden">

        {/* Hero image */}
        <div className="h-56 sm:h-80 relative bg-[#f4f6fb] overflow-hidden border-b border-[#dde3f0]">
          <img
            src={article.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          {/* Gov emblem */}
          <div className="absolute right-4 bottom-4 w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center opacity-30 pointer-events-none">
            <img src="/rajasthan_logo.png" alt="Emblem" className="w-full h-full object-contain p-1" />
          </div>
        </div>

        {/* Article header */}
        <div className="p-6 md:p-8 space-y-5 border-b border-[#dde3f0] bg-white">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={getCategoryBadge(article.category)}>{article.category}</span>
            {!article.published && (
              <span className="badge badge-red"><Shield className="w-2.5 h-2.5" /> {t('blogs.draftStatus')}</span>
            )}
            <span className="text-[10px] font-semibold text-[#5a6a8a] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(article.createdAt)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-[#dde3f0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f4821e]/10 border border-[#f4821e]/20 text-[#f4821e] flex items-center justify-center font-bold text-sm uppercase">
                {article.author?.name ? article.author.name.charAt(0) : 'A'}
              </div>
              <div>
                <p className="font-bold text-[#1a1a2e] text-sm leading-tight">{article.author?.name || t('blogs.officialRep')}</p>
                <p className="text-[10px] font-semibold text-[#5a6a8a]">{article.author?.email || 'doitc.circular@rajasthan.gov.in'}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#5a6a8a]">
              <Clock className="w-3.5 h-3.5" /> {estimateReadTime(article.content)}
            </span>
          </div>
        </div>

        {/* Summary blockquote */}
        <div className="px-6 md:px-8 pt-7 bg-white">
          <blockquote className="border-l-4 border-[#f4821e] pl-5 py-1 text-sm sm:text-base italic text-gray-700 leading-relaxed font-medium">
            {article.summary}
          </blockquote>
        </div>

        {/* Body content */}
        <div className="px-6 md:px-8 py-8 bg-white">
          <div className="text-sm leading-[1.85] text-gray-700 whitespace-pre-wrap space-y-4 font-normal">
            {article.content}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="px-6 md:px-8 py-4 bg-[#f4f6fb] border-t border-[#dde3f0] flex items-center gap-2 select-none">
          <Shield className="w-3.5 h-3.5 text-[#5a6a8a] flex-shrink-0" />
          <span className="text-[10px] font-semibold text-[#5a6a8a]">{t('blogs.docDisclaimer')}</span>
        </div>
      </article>
    </div>
  );
}
