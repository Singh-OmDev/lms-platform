import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, Shield, Sparkles, BookOpen } from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function ArticleReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useStore();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        addToast('Article not found or access restricted', 'danger');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate, addToast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const estimateReadTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Article link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8 animate-pulse font-sans">
        <div className="h-6 bg-neutral-300 rounded w-1/4" />
        <div className="h-10 bg-neutral-300 rounded w-3/4" />
        <div className="h-4 bg-neutral-300 rounded w-1/2" />
        <div className="h-64 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
        <div className="space-y-4">
          <div className="h-4 bg-neutral-300 rounded" />
          <div className="h-4 bg-neutral-300 rounded" />
          <div className="h-4 bg-neutral-300 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-3xl mx-auto py-4 pb-20 font-sans text-[#2d3748]">
      
      {/* Back Button & Share */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2540] hover:text-[#0b48a0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Publications
        </Link>
        
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Article
        </button>
      </div>

      {/* Main Reader Layout */}
      <article className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        
        {/* Banner Image */}
        <div className="h-56 sm:h-80 relative overflow-hidden bg-slate-900 border-b border-gray-200">
          <img
            src={article.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
            alt={article.title}
            className="w-full h-full object-cover opacity-85"
          />
          {/* Government Emblem Overlay */}
          <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center p-1.5 select-none pointer-events-none opacity-40">
            <img src="/rajasthan_logo.png" alt="Emblem" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Article Header Details */}
        <div className="p-6 md:p-8 space-y-4 border-b border-gray-100">
          
          {/* Badges & Date */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm border ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            {!article.published && (
              <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded-sm text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> Draft Status
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(article.createdAt)}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#0A2540] leading-tight">
            {article.title}
          </h1>

          {/* Author info & Read time */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500 font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0A2540] text-[#D4AF37] flex items-center justify-center font-bold text-xs uppercase border border-[#d4af37]">
                {article.author?.name ? article.author.name.charAt(0) : 'A'}
              </div>
              <div>
                <p className="font-bold text-gray-700 leading-tight">
                  {article.author?.name || 'Government representative'}
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  {article.author?.email || 'doitc.circular@rajasthan.gov.in'}
                </p>
              </div>
            </div>
            
            <span className="flex items-center gap-1 text-[10px]">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {estimateReadTime(article.content)}
            </span>
          </div>
        </div>

        {/* Article Summary Quote Box */}
        <div className="px-6 md:px-8 pt-6">
          <div className="p-4 bg-[#f8fafc] border-l-4 border-[#0A2540] rounded-r-md text-xs sm:text-sm italic text-gray-600 font-medium leading-relaxed">
            {article.summary}
          </div>
        </div>

        {/* Article Content Body */}
        <div className="px-6 md:px-8 py-8 prose prose-slate max-w-none">
          <div className="text-xs sm:text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-sans space-y-4">
            {article.content}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-150 text-[10px] text-gray-400 font-sans flex items-center gap-2 select-none">
          <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            This document represents an official tech bulletin of the Department of IT & Communication, Gov. of Rajasthan. Content is intended for regulatory training and educational compliance only.
          </span>
        </div>
      </article>
    </div>
  );
}
