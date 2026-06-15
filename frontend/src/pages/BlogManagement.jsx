import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Eye, Shield, X, Sparkles, BookOpen, Clock, FileText, Check, AlertTriangle
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
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;

    try {
      await api.delete(`/articles/${id}`);
      addToast('Article deleted successfully', 'success');
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-[#2d3748]">
      
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[#0A2540] to-[#123E66] text-white p-6 md:p-8 shadow-md border-b-4 border-[#D4AF37]">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-sm w-fit border border-[#D4AF37]/30">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> Admin Dossier
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight">
            Compliance & Blog Manager
          </h1>
          <p className="text-neutral-200 text-xs md:text-sm font-medium leading-relaxed">
            Create, publish, modify, or redact intelligence training articles and official technical alerts distributed across the Rajasthan State Network.
          </p>
        </div>
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-25 dark:opacity-40 select-none pointer-events-none hidden md:block">
          <img src="/rajasthan_logo.png" alt="Emblem" className="w-48 h-48 object-contain" />
        </div>
      </div>

      {/* Roster Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider border-b-2 border-[#D4AF37] pb-1 w-fit">
            Article Records Inventory
          </h3>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0A2540] hover:bg-[#071A2E] text-white font-bold text-xs rounded-md shadow-sm border-b-2 border-[#051321] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      {/* Articles Table Roster */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-4 p-8 animate-pulse">
            <div className="h-10 bg-neutral-300 rounded" />
            <div className="h-10 bg-neutral-300 rounded" />
            <div className="h-10 bg-neutral-300 rounded" />
          </div>
        ) : articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-550 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Article Title</th>
                  <th className="py-3.5 px-4 w-32">Category</th>
                  <th className="py-3.5 px-4 w-36">Author</th>
                  <th className="py-3.5 px-4 w-32">Created On</th>
                  <th className="py-3.5 px-4 w-28 text-center">Status</th>
                  <th className="py-3.5 px-4 w-36 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      <div className="truncate max-w-xs sm:max-w-md font-bold" title={art.title}>
                        {art.title}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-xs sm:max-w-md mt-0.5">
                        {art.summary}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-sm border ${
                        art.category === 'AI' 
                          ? 'bg-blue-100 text-blue-800 border-blue-200' 
                          : art.category === 'Cybersecurity'
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-semibold truncate max-w-[120px]">
                      {art.author?.name || 'DoIT&C Admin'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-550 font-semibold">
                      {formatDate(art.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`px-2 py-1 text-[9px] font-bold uppercase rounded-sm border tracking-wider transition-colors cursor-pointer ${
                          art.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-yellow-50 text-yellow-750 border-yellow-200 hover:bg-yellow-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {art.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/blogs/${art.id}`}
                          className="p-1.5 border border-gray-200 hover:border-gray-400 rounded bg-white text-gray-500 hover:text-gray-700 transition-colors"
                          title="Preview article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(art)}
                          className="p-1.5 border border-gray-200 hover:border-gray-400 rounded bg-white text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                          title="Edit article details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 border border-red-200 hover:bg-red-50 rounded bg-white text-red-650 hover:text-red-700 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 font-semibold">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No article records found in the database registry.</p>
            <p className="text-[10px] text-gray-450 font-normal mt-1">
              Click the "Write Article" button to compose your first tech publication.
            </p>
          </div>
        )}
      </div>

      {/* Write/Edit Sliding Side Panel Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-black/40 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowForm(false)} />

          <div className="relative w-full max-w-xl bg-white border-l border-gray-200 h-full p-6 md:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl z-10">
            <div>
              {/* Header */}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                
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
