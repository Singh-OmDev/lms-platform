import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, Plus, Edit2, Trash2, Eye, UploadCloud, Film, ImageIcon,
  Check, X
} from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function VideoManagement() {
  const { addToast } = useStore();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal toggle
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // Bulk operations states
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('600');
  const [tags, setTags] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('10 mins');

  // Drag & drop upload simulator states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/videos');
      setVideos(res.data);
      const resCat = await api.get('/videos/categories');
      setCategories(resCat.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load courses inventory', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setDifficulty('Beginner');
    setVideoUrl('');
    setThumbnailUrl('');
    setDuration('600');
    setTags('');
    setEstimatedTime('10 mins');
    setUploadProgress(0);
    setUploading(false);
    setEditingVideo(null);
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setCategory(video.category);
    setDifficulty(video.difficulty);
    setVideoUrl(video.videoUrl);
    setThumbnailUrl(video.thumbnailUrl);
    setDuration(video.duration.toString());
    setTags(video.tags || '');
    setEstimatedTime(video.estimatedTime || '');
    setShowUploadForm(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleRealUpload(e.dataTransfer.files[0]);
    }
  };

  const handleZoneClick = () => {
    if (uploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleRealUpload(e.target.files[0]);
    }
  };

  const handleRealUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const { videoUrl, thumbnailUrl, duration } = res.data;
      setVideoUrl(videoUrl);
      setThumbnailUrl(thumbnailUrl);
      setDuration(duration.toString());
      setEstimatedTime(`${Math.ceil(duration / 60)} mins`);

      addToast('Video uploaded to Cloudinary successfully', 'success');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Failed to upload video to Cloudinary';
      addToast(errorMsg, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !videoUrl || !thumbnailUrl) {
      addToast('Please fill in all mandatory fields', 'danger');
      return;
    }

    try {
      const payload = {
        title,
        description,
        category,
        videoUrl,
        thumbnailUrl,
        duration: parseInt(duration),
        difficulty,
        tags,
        estimatedTime: estimatedTime || `${Math.ceil(parseInt(duration) / 60)} mins`
      };

      if (editingVideo) {
        await api.put(`/videos/${editingVideo.id}`, payload);
        addToast('Video updated successfully', 'success');
      } else {
        await api.post('/videos', payload);
        addToast('Video uploaded successfully', 'success');
      }

      resetForm();
      setShowUploadForm(false);
      fetchVideos();
    } catch (err) {
      console.error(err);
      addToast('Operation failed', 'danger');
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      addToast('Video deleted successfully', 'info');
      fetchVideos();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete video', 'danger');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === videos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(videos.map(v => v.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected videos?`)) return;

    try {
      for (const id of selectedIds) {
        await api.delete(`/videos/${id}`);
      }
      addToast('Bulk delete successfully processed', 'info');
      setSelectedIds([]);
      fetchVideos();
    } catch (err) {
      console.error(err);
      addToast('Bulk operation failed', 'danger');
    }
  };

  const handleBulkCategoryChange = async () => {
    if (selectedIds.length === 0 || !bulkCategory) return;
    try {
      for (const id of selectedIds) {
        await api.put(`/videos/${id}`, { category: bulkCategory });
      }
      addToast('Categories updated successfully', 'success');
      setSelectedIds([]);
      setBulkCategory('');
      fetchVideos();
    } catch (err) {
      console.error(err);
      addToast('Bulk category update failed', 'danger');
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#d2d6dc] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#002c6c] tracking-tight">Course Inventory Registry</h1>
          <p className="text-neutral-550 text-xs mt-1">
            Maintain video lectures, adjust tags, and manage curriculum metadata.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowUploadForm(true);
          }}
          className="btn-primary flex items-center gap-1.5 text-xs py-2.5"
        >
          <Plus className="w-4 h-4" /> Add Video Course
        </button>
      </div>

      {/* Bulk actions banner */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-sm bg-white border border-[#cbd5e0] text-xs shadow-sm font-sans font-semibold">
          <span className="text-[#002c6c]">{selectedIds.length} lessons selected for bulk actions:</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="bg-white border border-[#cbd5e0] rounded-sm px-2.5 py-1.5 text-xs text-[#2d3748] outline-none"
              >
                <option value="">Move Category...</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
              <button 
                onClick={handleBulkCategoryChange}
                disabled={!bulkCategory}
                className="btn-secondary py-1.5 px-3 text-xs cursor-pointer"
              >
                Apply
              </button>
            </div>

            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-sm text-xs font-semibold transition-colors cursor-pointer"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Videos Data Table */}
      <div className="bg-white border border-[#cbd5e0] rounded-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-neutral-500 font-mono text-xs animate-pulse">Loading registry databases...</div>
        ) : videos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#cbd5e0] bg-[#f8fafc] text-neutral-600 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === videos.length} 
                      onChange={toggleSelectAll}
                      className="rounded border-[#cbd5e0] bg-white accent-[#002c6c] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Difficulty</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="border-b border-[#cbd5e0] hover:bg-[#f8fafc] text-neutral-600">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(v.id)} 
                        onChange={() => toggleSelect(v.id)}
                        className="rounded border-[#cbd5e0] bg-white accent-[#002c6c] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <img src={v.thumbnailUrl} alt={v.title} className="w-14 h-9 object-cover rounded-sm border border-[#cbd5e0] bg-neutral-100" />
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-serif font-bold text-[#002c6c]">{v.title}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-500">{v.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase border border-[#cbd5e0] bg-[#f8fafc] text-neutral-600">
                        {v.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/video/${v.id}`} className="p-1.5 border border-[#cbd5e0] hover:border-neutral-500 rounded bg-white text-neutral-500 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleEditClick(v)} className="p-1.5 border border-[#cbd5e0] hover:border-neutral-500 rounded bg-white text-neutral-500 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 border border-red-200 hover:bg-red-50 rounded bg-white text-red-650 transition-colors">
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
          <div className="text-center py-16 text-neutral-500 text-xs">No video records registered.</div>
        )}
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-black/40">
          <div className="absolute inset-0" onClick={() => setShowUploadForm(false)} />

          <div className="relative w-full max-w-xl bg-white border-l border-[#cbd5e0] h-full p-8 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-5 border-b border-[#cbd5e0] mb-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#002c6c] uppercase tracking-wider">
                    {editingVideo ? 'Overwrite Course Details' : 'Register New Course'}
                  </h3>
                  <p className="text-neutral-500 text-xs mt-1">Configure metadata variables and play URLs.</p>
                </div>
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="text-neutral-550 hover:text-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Drag and drop zone */}
                {!editingVideo && (
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleZoneClick}
                    className={`
                      border border-dashed rounded-sm p-5 text-center transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer
                      ${dragActive ? 'border-[#002c6c] bg-[#f0f4f8]' : 'border-[#cbd5e0] hover:border-neutral-500 bg-[#f8fafc]'}
                    `}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/*"
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-[#002c6c]" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#002c6c]">Drag & drop video payload (MP4)</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">or click to choose local files</p>
                    </div>
                    
                    {uploading && (
                      <div className="w-full max-w-xs space-y-1.5 mt-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between text-[9px] text-neutral-400 font-mono font-semibold">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-[#e2e8f0] h-1.5 rounded-sm overflow-hidden border border-[#cbd5e0]">
                          <div className="bg-[#002c6c] h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">Video Course Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Introduction to Generative Adversarial Networks (GANs)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">Description</label>
                    <textarea 
                      required
                      placeholder="e.g. In this video, we cover generator and discriminator models..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-input text-xs h-20 resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">Category Domain</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-white border border-[#c3c8cf] rounded-sm px-3 py-2.5 text-xs text-[#2d3748] w-full outline-none focus:border-[#002c6c] cursor-pointer"
                    >
                      <option value="">Select Domain...</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="bg-white border border-[#c3c8cf] rounded-sm px-3 py-2.5 text-xs text-[#2d3748] w-full outline-none focus:border-[#002c6c] cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Video URL */}
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-[#4a5568]">Video Stream URL</label>
                    <input 
                      type="text" 
                      required
                      placeholder="https://..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="form-input text-xs font-mono"
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-[#4a5568]">Thumbnail Image URL</label>
                    <input 
                      type="text" 
                      required
                      placeholder="https://..."
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="form-input text-xs font-mono"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">Duration (Seconds)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="600"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="form-input text-xs font-mono"
                    />
                  </div>

                  {/* Estimated time */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">Duration Tag</label>
                    <input 
                      type="text" 
                      placeholder="10 mins"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      className="form-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-grow text-xs py-2.5"
                  >
                    {editingVideo ? 'Save Changes' : 'Confirm Registration'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="btn-secondary px-6 text-xs"
                  >
                    Cancel
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
