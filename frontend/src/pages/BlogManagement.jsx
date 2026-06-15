import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Eye, Shield, X, Sparkles, BookOpen, Clock, FileText, Check, AlertTriangle,
  Search, ChevronLeft, ChevronRight, Filter, AlertCircle, Calendar
} from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function BlogManagement() {
  const { addToast } = useStore();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Search, Filter, Sort, Pagination, Selection, Custom Dialogs
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // id or 'bulk'
  const [previewArticle, setPreviewArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/articles');
      setArticles(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch articles roster', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('AI');
    setSummary('');
    setImageUrl('');
    setContent('');
    setPublished(true);
    setEditingArticle(null);
  };

  const handleEditClick = (article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setCategory(article.category);
    setSummary(article.summary);
    setImageUrl(article.imageUrl || '');
    setContent(article.content);
    setPublished(article.published);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      addToast('Article deleted successfully', 'success');
      setDeleteConfirmId(null);
      // Remove deleted item from selection if any
      setSelectedArticleIds(prev => prev.filter(x => x !== id));
      fetchArticles();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete the article', 'danger');
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      const updatedStatus = !article.published;
      await api.put(`/articles/${article.id}`, { published: updatedStatus });
      addToast(
        `Article ${updatedStatus ? 'published' : 'saved to drafts'} successfully`, 
        'success'
      );
      fetchArticles();
    } catch (err) {
      console.error(err);
      addToast('Failed to change publication status', 'danger');
    }
  };

  const handleBulkStatusChange = async (publishState) => {
    try {
      setSubmitting(true);
      await Promise.all(
        selectedArticleIds.map(id => api.put(`/articles/${id}`, { published: publishState }))
      );
      addToast(
        `Successfully ${publishState ? 'published' : 'saved to drafts'} ${selectedArticleIds.length} articles`,
        'success'
      );
      setSelectedArticleIds([]);
      fetchArticles();
    } catch (err) {
      console.error(err);
      addToast('Failed to update selected articles', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setSubmitting(true);
      await Promise.all(
        selectedArticleIds.map(id => api.delete(`/articles/${id}`))
      );
      addToast(`Successfully deleted ${selectedArticleIds.length} articles`, 'success');
      setSelectedArticleIds([]);
      setDeleteConfirmId(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete selected articles', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !summary.trim()) {
      addToast('Please fill in all required fields', 'danger');
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      category,
      summary,
      imageUrl: imageUrl.trim() || undefined,
      content,
      published
    };

    try {
      if (editingArticle) {
        await api.put(`/articles/${editingArticle.id}`, payload);
        addToast('Article updated successfully', 'success');
      } else {
        await api.post('/articles', payload);
        addToast('Article published successfully', 'success');
      }
      resetForm();
      setShowForm(false);
      fetchArticles();
    } catch (err) {
      console.error(err);
      addToast(
        editingArticle ? 'Failed to update article' : 'Failed to publish article', 
        'danger'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryBadgeClass = (cat) => {
    const c = cat ? cat.toLowerCase() : '';
    if (c.includes('ai') || c.includes('intelligence')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/50';
    }
    if (c.includes('cyber') || c.includes('security')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/50';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200/50';
  };

  // Filter & Sort Calculations
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      art.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'AI' && art.category.toLowerCase().includes('intelligence'));
      
    const matchesStatus = 
      selectedStatus === 'All' || 
      (selectedStatus === 'Published' && art.published) ||
      (selectedStatus === 'Draft' && !art.published);
      
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'updated') {
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // Pagination Calculations
  const totalItems = sortedArticles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = sortedArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedArticleIds(paginatedArticles.map(art => art.id));
    } else {
      setSelectedArticleIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedArticleIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Stats
  const totalCount = articles.length;
  const publishedCount = articles.filter(a => a.published).length;
  const draftCount = articles.filter(a => !a.published).length;

  return (
    <div className="space-y-6 pb-16 font-sans text-gray-700">
      
      {/* Page Header Hero */}
      <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-[#0A2540] to-[#123E66] text-white p-5 md:p-6 shadow-md border-b border-[#cbd5e0]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-sm w-fit border border-[#D4AF37]/30">
            <Shield className="w-3 h-3 text-[#D4AF37]" /> Admin Dossier
          </div>
          <h1 className="text-lg md:text-xl font-serif font-bold tracking-tight">
            Compliance & Blog Manager
          </h1>
          <p className="text-gray-200 text-xs font-medium leading-relaxed">
            Create, publish, modify, or redact intelligence training articles and official technical alerts distributed across the Rajasthan State Network.
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/5 rounded-full p-1.5 border border-white/10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          <img src="/rajasthan_logo.png" alt="Emblem" className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-95 filter drop-shadow-md" />
        </div>
      </div>

      {/* Stats Counter Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Articles</span>
            <h4 className="text-xl font-bold text-[#0A2540]">{totalCount}</h4>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Published Articles</span>
            <h4 className="text-xl font-bold text-[#0A2540]">{publishedCount}</h4>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Check className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Draft Bulletins</span>
            <h4 className="text-xl font-bold text-[#0A2540]">{draftCount}</h4>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Search, Filter, and Controls Row */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between bg-white border border-gray-250/70 rounded-md p-4 shadow-sm">
        {/* Category Segmented Tabs */}
        <div className="flex overflow-x-auto space-x-1 p-1 bg-gray-100 rounded-lg max-w-full scrollbar-none flex-shrink-0">
          {['All', 'AI', 'Cybersecurity', 'General'].map(cat => {
            const count = cat === 'All' 
              ? articles.length 
              : articles.filter(a => 
                  a.category.toLowerCase() === cat.toLowerCase() ||
                  (cat === 'AI' && a.category.toLowerCase().includes('intelligence'))
                ).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                  setSelectedArticleIds([]);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-[#0A2540] shadow-sm'
                    : 'text-gray-650 hover:text-[#0A2540] hover:bg-white/40'
                }`}
              >
                {cat === 'AI' ? 'AI' : cat === 'General' ? 'General' : cat}
                <span className="ml-1 text-[10px] text-gray-400 font-normal">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] sm:max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setSelectedArticleIds([]);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-xs bg-gray-50 focus:bg-white outline-none transition-all focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
            />
          </div>

          {/* Status Select */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
                setSelectedArticleIds([]);
              }}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-md text-xs bg-gray-50 focus:bg-white outline-none transition-all focus:border-[#0A2540]"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="relative flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-md text-xs bg-gray-50 focus:bg-white outline-none transition-all focus:border-[#0A2540]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Article Directory
          </h3>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0A2540] to-[#123E66] hover:from-[#071A2E] hover:to-[#0A2540] text-white font-bold text-xs rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 duration-150"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      {/* Articles Table Roster */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-4 p-8 animate-pulse">
            <div className="h-10 bg-neutral-200 rounded" />
            <div className="h-10 bg-neutral-200 rounded" />
            <div className="h-10 bg-neutral-200 rounded" />
          </div>
        ) : paginatedArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-650 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center align-middle">
                    <input 
                      type="checkbox"
                      className="w-3.5 h-3.5 border-gray-300 rounded text-[#0A2540] focus:ring-[#0A2540] cursor-pointer"
                      checked={paginatedArticles.length > 0 && paginatedArticles.every(art => selectedArticleIds.includes(art.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 align-middle">Article Title</th>
                  <th className="py-3 px-4 w-28 align-middle hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4 w-36 align-middle hidden md:table-cell">Author</th>
                  <th className="py-3 px-4 w-28 align-middle hidden lg:table-cell">Created On</th>
                  <th className="py-3 px-4 w-28 align-middle hidden xl:table-cell">Updated On</th>
                  <th className="py-3 px-4 w-28 text-center align-middle">Status</th>
                  <th className="py-3 px-4 w-36 text-center align-middle">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {paginatedArticles.map((art) => (
                  <tr key={art.id} className={`hover:bg-gray-50/50 transition-colors align-middle ${selectedArticleIds.includes(art.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4 text-center align-middle">
                      <input 
                        type="checkbox"
                        className="w-3.5 h-3.5 border-gray-300 rounded text-[#0A2540] focus:ring-[#0A2540] cursor-pointer"
                        checked={selectedArticleIds.includes(art.id)}
                        onChange={() => handleSelectRow(art.id)}
                      />
                    </td>
                    <td className="py-3.5 px-4 align-middle font-medium text-gray-800">
                      <div 
                        className="truncate max-w-xs sm:max-w-sm md:max-w-md font-bold text-gray-800 hover:text-[#0A2540] transition-colors cursor-pointer" 
                        onClick={() => setPreviewArticle(art)}
                        title="Click to preview article"
                      >
                        {art.title}
                      </div>
                      <div className="text-[10px] text-gray-500 line-clamp-1 max-w-xs sm:max-w-sm md:max-w-md mt-0.5 font-normal">
                        {art.summary}
                      </div>
                      
                      {/* Mobile details (shows when columns are hidden) */}
                      <div className="block lg:hidden text-[9px] text-gray-500 mt-1 font-normal space-y-0.5">
                        <span className="sm:hidden font-semibold bg-gray-100 px-1 py-0.2 rounded mr-1.5">{art.category}</span>
                        <span className="md:hidden">By {art.author?.name || 'DoIT&C Admin'} • </span>
                        <span>Created {formatDate(art.createdAt)}</span>
                        <span className="hidden md:inline lg:hidden"> • Updated {formatDate(art.updatedAt)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-middle hidden sm:table-cell">
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border whitespace-nowrap ${getCategoryBadgeClass(art.category)}`}>
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-middle hidden md:table-cell text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px] uppercase select-none flex-shrink-0 border border-slate-300">
                          {(art.author?.name || 'DoIT&C').charAt(0)}
                        </div>
                        <span className="font-semibold truncate max-w-[100px]">
                          {art.author?.name || 'DoIT&C Admin'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-middle text-gray-700 font-medium hidden lg:table-cell">
                      {formatDate(art.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 align-middle text-gray-700 font-medium hidden xl:table-cell">
                      {formatDate(art.updatedAt || art.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 align-middle text-center">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase rounded-full border tracking-wider transition-all duration-150 cursor-pointer shadow-sm hover:scale-[1.02] ${
                          art.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100'
                            : 'bg-amber-50/70 text-amber-700 border-amber-200/50 hover:bg-amber-100/70'
                        }`}
                        title="Click to toggle publication state"
                      >
                        {art.published ? (
                          <Check className="w-2.8 h-2.8 text-emerald-600" />
                        ) : (
                          <Clock className="w-2.8 h-2.8 text-amber-600" />
                        )}
                        <span>{art.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setPreviewArticle(art)}
                          className="w-9 h-9 border border-gray-200 hover:border-gray-400 rounded-md bg-white text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                          title="Preview article content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(art)}
                          className="w-9 h-9 border border-gray-200 hover:border-gray-400 rounded-md bg-white text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                          title="Edit article details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(art.id)}
                          className="w-9 h-9 border border-red-100 hover:border-red-300 rounded-md bg-white text-red-650 hover:text-red-700 hover:bg-red-50/30 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 font-semibold">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No article records match the active criteria.</p>
            <p className="text-[10px] text-gray-400 font-normal mt-1">
              Adjust your search keywords/filters or click "Write Article" to compose one.
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3.5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
            <div className="text-gray-550 font-medium">
              Showing <span className="font-semibold text-gray-800">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-800">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-semibold text-gray-800">{totalItems}</span> articles
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-650 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7.5 h-7.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#0A2540] text-white shadow-sm'
                        : 'border border-gray-300 bg-white text-gray-650 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-650 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Panel */}
      {selectedArticleIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white rounded-lg shadow-2xl px-6 py-3.5 flex items-center justify-between gap-6 z-40 animate-in slide-in-from-bottom-6 duration-200 w-[90%] max-w-xl">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#D4AF37] text-slate-950 font-bold text-xs w-5.5 h-5.5 rounded-full flex items-center justify-center">
              {selectedArticleIds.length}
            </div>
            <span className="text-xs font-semibold text-slate-200">selected</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleBulkStatusChange(true)}
              disabled={submitting}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded border border-emerald-500/30 text-xs font-bold cursor-pointer transition-colors"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange(false)}
              disabled={submitting}
              className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white rounded border border-amber-500/30 text-xs font-bold cursor-pointer transition-colors"
            >
              Draft
            </button>
            <button
              onClick={() => setDeleteConfirmId('bulk')}
              disabled={submitting}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-650 text-red-450 hover:text-white rounded border border-red-500/30 text-xs font-bold cursor-pointer transition-colors"
            >
              Delete
            </button>
            <div className="h-4 w-px bg-slate-700 mx-1"></div>
            <button
              onClick={() => setSelectedArticleIds([])}
              className="p-1 text-slate-400 hover:text-white cursor-pointer rounded hover:bg-slate-800"
              title="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-start gap-3.5 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-full flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">
                  {deleteConfirmId === 'bulk' ? 'Delete Selected Articles' : 'Delete Technical Article'}
                </h3>
                <p className="text-xs text-gray-500 leading-normal">
                  {deleteConfirmId === 'bulk'
                    ? `Are you sure you want to permanently delete the ${selectedArticleIds.length} selected articles?`
                    : `Are you sure you want to permanently delete "${articles.find(a => a.id === deleteConfirmId)?.title}"?`}
                  {' '}This operation is irreversible and all selected articles will be permanently removed.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-3.5 border-t border-gray-150">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmId === 'bulk') {
                    handleBulkDelete();
                  } else {
                    handleDelete(deleteConfirmId);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white text-xs font-bold rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Article Preview Side Panel Drawer */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setPreviewArticle(null)} />
          
          <div className="relative w-full max-w-2xl bg-white border-l border-gray-200 h-full p-6 md:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Preview Header */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-255">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border whitespace-nowrap ${getCategoryBadgeClass(previewArticle.category)}`}>
                      {previewArticle.category}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full border tracking-wide ${
                      previewArticle.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                        : 'bg-amber-50/70 text-amber-700 border-amber-200/50'
                    }`}>
                      {previewArticle.published ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                      )}
                      <span>{previewArticle.published ? 'Published' : 'Draft'}</span>
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-serif font-bold text-gray-900 leading-tight">
                    {previewArticle.title}
                  </h2>
                </div>
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1.5 hover:bg-gray-100 rounded-full flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Image */}
              {previewArticle.imageUrl && (
                <div className="rounded-md overflow-hidden bg-gray-100 border border-gray-250 max-h-56 shadow-inner">
                  <img
                    src={previewArticle.imageUrl}
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Preview Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-55 border border-gray-200 rounded-md text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wider">Author</span>
                  <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px] uppercase border border-slate-300">
                      {(previewArticle.author?.name || 'DoIT&C').charAt(0)}
                    </div>
                    <span className="truncate">{previewArticle.author?.name || 'DoIT&C Admin'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wider">Created On</span>
                  <span className="font-semibold text-gray-700">{formatDate(previewArticle.createdAt)}</span>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wider">Last Updated</span>
                  <span className="font-semibold text-gray-700">{formatDate(previewArticle.updatedAt || previewArticle.createdAt)}</span>
                </div>
              </div>

              {/* Preview Summary */}
              <div className="p-4 bg-blue-50/40 border-l-4 border-blue-600 text-xs text-blue-950 italic leading-relaxed rounded-r-md">
                <strong>Executive Summary:</strong> {previewArticle.summary}
              </div>

              {/* Preview Content Body */}
              <div className="space-y-4 text-xs text-gray-850 leading-relaxed font-sans whitespace-pre-wrap border-t border-gray-100 pt-4 pb-12">
                {previewArticle.content}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-md transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write/Edit Sliding Side Panel Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-black/40 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowForm(false)} />

          <div className="relative w-full max-w-xl bg-white border-l border-gray-250 h-full p-6 md:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            <div>
              {/* Form Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#0A2540] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    {editingArticle ? 'Overwrite Article Details' : 'Compose Technical Bulletin'}
                  </h3>
                  <p className="text-gray-500 text-[10px] mt-0.5">
                    Specify metadata variables, summary descriptions, and markdown content details.
                  </p>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Mandatory Security Patches for State IT Databases"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-300 rounded-md text-xs text-gray-800 outline-none transition-all focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Category Track <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-300 rounded-md text-xs text-gray-800 outline-none transition-all focus:border-[#0A2540]"
                    >
                      <option value="AI">AI (Artificial Intelligence)</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="General">General Technology</option>
                    </select>
                  </div>

                  {/* Thumbnail Image URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Feature Image URL
                    </label>
                    <input 
                      type="url" 
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-300 rounded-md text-xs text-gray-800 outline-none transition-all focus:border-[#0A2540]"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    Brief Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required
                    rows={2}
                    maxLength={250}
                    placeholder="Provide a concise 1-2 sentence preview summary of the technical contents..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-300 rounded-md text-xs text-gray-800 outline-none transition-all focus:border-[#0A2540] resize-none"
                  />
                  <div className="text-[9px] text-gray-400 text-right">
                    {250 - summary.length} characters remaining
                  </div>
                </div>

                {/* Content Body */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    Detailed Article Content <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required
                    rows={12}
                    placeholder="Draft the complete educational details or directives here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-300 rounded-md text-xs text-gray-800 font-sans outline-none transition-all focus:border-[#0A2540]"
                  />
                </div>

                {/* Published Checkbox Toggle */}
                <div className="flex items-center space-x-2 pt-2 select-none">
                  <input 
                    type="checkbox" 
                    id="publishedToggle"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 border-gray-300 text-[#0A2540] focus:ring-[#0A2540] rounded cursor-pointer"
                  />
                  <label htmlFor="publishedToggle" className="text-xs text-gray-700 font-semibold cursor-pointer">
                    Publish immediately (visible to all students in their feed)
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-150 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-650 hover:bg-gray-50 text-xs font-bold rounded-md transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1 px-4 py-2 bg-[#0A2540] hover:bg-[#071A2E] text-white font-bold text-xs rounded-md shadow-sm border-b-2 border-[#051321] transition-colors cursor-pointer disabled:opacity-55"
                  >
                    {submitting ? 'Submitting...' : editingArticle ? 'Update Publication' : 'Release Article'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
