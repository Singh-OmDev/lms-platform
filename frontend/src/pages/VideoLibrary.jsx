import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  Play, 
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function VideoLibrary() {
  const { addToast } = useStore();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and view states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const resCat = await api.get('/videos/categories');
        setCategories(['All', ...resCat.data.map(c => c.name)]);
      } catch (e) {
        console.error(e);
      }
    };
    loadFiltersData();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedStatus !== 'All') params.status = selectedStatus;
        if (sortBy !== 'Default') params.sortBy = sortBy;

        const res = await api.get('/videos', { params });
        setVideos(res.data);
      } catch (err) {
        console.error(err);
        addToast('Failed to retrieve video catalog', 'danger');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchVideos();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, selectedStatus, sortBy]);

  const formatDuration = (secs) => {
    const mm = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      {/* Dossier Header */}
      <div className="border-b-2 border-[#d2d6dc] pb-4">
        <h1 className="text-xl font-serif font-bold text-[#002c6c] tracking-tight">Public Course Catalog</h1>
        <p className="text-neutral-500 text-xs mt-1">
          Explore and enroll in certified technology and cyber-defense course directories.
        </p>
      </div>

      {/* Filter and Search Action Bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between p-4 rounded-sm border border-[#cbd5e0] bg-white shadow-sm">
        {/* Search */}
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search courses catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        {/* Filter Groups */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Domain</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#c3c8cf] rounded-sm px-2.5 py-1.5 text-xs text-[#2d3748] outline-none focus:border-[#002c6c] cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-[#c3c8cf] rounded-sm px-2.5 py-1.5 text-xs text-[#2d3748] outline-none focus:border-[#002c6c] cursor-pointer"
            >
              <option value="All">All Progress</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#c3c8cf] rounded-sm px-2.5 py-1.5 text-xs text-[#2d3748] outline-none focus:border-[#002c6c] cursor-pointer"
            >
              <option value="Default">Default</option>
              <option value="Newest">Newest</option>
            </select>
          </div>

          {/* View Modes */}
          <div className="flex items-center border border-[#cbd5e0] rounded-sm bg-[#f8fafc] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#002c6c] text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#002c6c] text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Skeletons or Video items */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-[#cbd5e0] rounded-sm p-4 animate-pulse space-y-3">
              <div className="aspect-video bg-neutral-200 rounded-sm border border-[#d2d6dc]" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {videos.map((video) => (
            <div
              key={video.id}
              className={`
                rounded-sm border border-[#cbd5e0] bg-white hover:border-[#b1b7c1] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-sm
                ${viewMode === 'grid' ? 'h-full' : 'md:flex-row md:items-center md:p-4 md:gap-6'}
              `}
            >
              {/* Image Thumbnail */}
              <div className={`
                relative bg-neutral-100 flex-shrink-0 border-b border-[#cbd5e0] overflow-hidden
                ${viewMode === 'grid' ? 'aspect-video w-full' : 'w-48 aspect-video rounded-sm border border-[#cbd5e0] md:border-b-0'}
              `}>
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded-sm text-[10px] font-mono text-white border border-neutral-700 select-none">
                  {formatDuration(video.duration)}
                </span>
                
                {/* Watch overlay button */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Link to={`/video/${video.id}`} className="w-10 h-10 rounded-full bg-[#002c6c] text-white flex items-center justify-center hover:scale-105 transition-transform shadow">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </Link>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-grow p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 select-none">
                    <span className="text-[9px] font-bold uppercase bg-[#f0f4f8] text-[#002c6c] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                      {video.category}
                    </span>
                    <span className="text-[9px] font-bold uppercase bg-[#f0f4f8] text-[#002c6c] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                      {video.difficulty}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#002c6c] line-clamp-1">
                    {video.title}
                  </h3>
                  
                  <p className="text-neutral-500 text-xs leading-normal line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Progress bar and watch link */}
                <div className="space-y-2.5 pt-1">
                  {video.progress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-neutral-500 font-semibold">
                        <span>Curriculum Progress</span>
                        <span>{Math.round(video.progress.completionPercentage)}% Completed</span>
                      </div>
                      <div className="w-full bg-[#e2e8f0] h-2 rounded-sm overflow-hidden border border-[#cbd5e0]">
                        <div 
                          className="bg-[#002c6c] h-full transition-all" 
                          style={{ width: `${video.progress.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/video/${video.id}`}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      {video.progress?.completed ? 'Review Lesson' : video.progress?.currentTime > 0 ? 'Resume Lesson' : 'Launch Course'}
                    </Link>
                    {video.progress?.completed && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm select-none">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty */
        <div className="text-center py-16 border border-[#cbd5e0] bg-white rounded-sm max-w-md mx-auto space-y-3 shadow-sm">
          <FolderOpen className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-serif font-bold text-sm text-[#002c6c]">No Courses Found</h3>
          <p className="text-neutral-500 text-xs max-w-xs mx-auto">
            Try adjusting search inputs, changing category selections, or clearing filters.
          </p>
        </div>
      )}
    </div>
  );
}
