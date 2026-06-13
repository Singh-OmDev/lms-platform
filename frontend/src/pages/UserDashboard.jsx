import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, ChevronRight, Sparkles, Award } from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, addToast } = useStore();
  
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

        // Filter In-Progress courses
        const inProgress = allVideos.filter(
          v => v.progress && !v.progress.completed && v.progress.completionPercentage > 0
        );

        // Filter Recommended courses (not started or completed)
        const notStarted = allVideos.filter(
          v => !v.progress || (!v.progress.completed && v.progress.completionPercentage === 0)
        );

        // Newest additions
        const sortedNewest = [...allVideos].sort((a, b) => b.id - a.id);

        setContinueWatching(inProgress);
        setRecommended(notStarted.slice(0, 3));
        setRecentAdded(sortedNewest.slice(0, 4));
      } catch (err) {
        console.error(err);
        addToast('Failed to load learning dashboard', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse font-sans">
        <div className="h-32 bg-neutral-300 rounded-sm border border-[#cbd5e0]" />
        <div className="space-y-4">
          <div className="h-6 bg-neutral-300 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-40 bg-neutral-300 rounded border border-[#cbd5e0]" />
            <div className="h-40 bg-neutral-300 rounded border border-[#cbd5e0]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans text-[#2d3748]">
      
      {/* Welcome & Branding Banner */}
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[#002c6c] to-[#0d3b80] text-white p-6 md:p-8 shadow-md border-b-4 border-[#f2a900]">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#f2a900] bg-white/10 px-2 py-0.5 rounded-sm w-fit border border-[#f2a900]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#f2a900]" /> Student Learning Console
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-neutral-200 text-xs md:text-sm font-medium leading-relaxed">
            Rajasthan Portal for Artificial Intelligence and Cybersecurity Training. Continue your customized technology track or explore new curriculum modules below.
          </p>
        </div>
        {/* Background Emblem Accent */}
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-10 select-none pointer-events-none hidden md:block">
          <img src="/rajasthan_logo.png" alt="Emblem" className="w-48 h-48 object-contain" />
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="border-b border-[#cbd5e0] pb-2 flex justify-between items-center">
          <h2 className="text-base font-serif font-bold text-[#002c6c] tracking-tight">Continue Learning</h2>
          <span className="text-[10px] font-mono text-neutral-500 font-bold bg-[#edf2f7] px-2 py-0.5 rounded-sm">
            {continueWatching.length} In Progress
          </span>
        </div>

        {continueWatching.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {continueWatching.map((v) => (
              <div key={v.id} className="rounded-sm border border-[#cbd5e0] overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-[#b1b7c1] transition-all flex flex-col justify-between">
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase bg-[#f0f4f8] text-[#002c6c] px-2 py-0.5 rounded-sm border border-[#cbd5e0] inline-block mb-2">
                        {v.category}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-[#002c6c] line-clamp-1">{v.title}</h3>
                    </div>
                    <img src={v.thumbnailUrl} alt={v.title} className="w-16 h-10 object-cover rounded-sm border border-[#cbd5e0] flex-shrink-0" />
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500 font-semibold">
                      <span>Course Progress</span>
                      <span>{Math.round(v.progress.completionPercentage)}%</span>
                    </div>
                    <div className="w-full bg-[#e2e8f0] h-2 rounded-sm overflow-hidden border border-[#cbd5e0]">
                      <div className="bg-[#002c6c] h-full transition-all" style={{ width: `${v.progress.completionPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] border-t border-[#cbd5e0] px-5 py-3 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Est: {v.estimatedTime || '10 mins'}
                  </span>
                  <Link to={`/video/${v.id}`} className="btn-primary py-1 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <Play className="w-3 h-3 fill-current" /> Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-sm border border-[#cbd5e0] bg-white text-center text-neutral-500 text-xs shadow-sm space-y-2">
            <BookOpen className="w-6 h-6 text-neutral-400 mx-auto" />
            <p className="font-medium">No active courses in progress.</p>
            <p className="text-[10px]">Head over to the <Link to="/library" className="text-[#002c6c] font-bold underline">Courses Catalog</Link> to enroll and start learning.</p>
          </div>
        )}
      </div>

      {/* Grid: Recommended & New Arrivals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recommended Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-[#cbd5e0] pb-2">
            <h2 className="text-base font-serif font-bold text-[#002c6c] tracking-tight">Recommended for You</h2>
          </div>
          
          <div className="space-y-3">
            {recommended.length > 0 ? (
              recommended.map((v) => (
                <div key={v.id} className="p-4 rounded-sm border border-[#cbd5e0] bg-white hover:shadow-sm hover:border-[#b1b7c1] transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={v.thumbnailUrl} alt={v.title} className="w-20 h-12 object-cover rounded-sm border border-[#cbd5e0] flex-shrink-0" />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[8px] font-bold uppercase bg-[#edf2f7] text-[#002c6c] px-1.5 py-0.5 rounded-sm border border-[#cbd5e0]">
                        {v.category}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-[#002c6c] truncate mt-1">{v.title}</h4>
                      <p className="text-[10px] text-neutral-500 line-clamp-1">{v.description}</p>
                    </div>
                  </div>
                  <Link to={`/video/${v.id}`} className="p-2 border border-[#cbd5e0] rounded-sm hover:bg-[#f0f4f8] text-[#002c6c] transition-colors flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-neutral-500 border border-dashed border-[#cbd5e0] rounded-sm">
                All courses successfully enrolled!
              </div>
            )}
          </div>
        </div>

        {/* Right: New Additions Log */}
        <div className="space-y-4">
          <div className="border-b border-[#cbd5e0] pb-2">
            <h2 className="text-base font-serif font-bold text-[#002c6c] tracking-tight">New Course Additions</h2>
          </div>
          
          <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white shadow-sm space-y-4">
            {recentAdded.map((v) => (
              <Link 
                key={v.id} 
                to={`/video/${v.id}`} 
                className="flex items-start gap-3 text-xs border-b border-[#f0f4f8] pb-3 last:border-0 last:pb-0 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#f2a900] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-[#002c6c] group-hover:underline truncate">{v.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-550 mt-0.5 font-mono uppercase font-semibold">
                    <span>{v.category}</span>
                    <span>•</span>
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
