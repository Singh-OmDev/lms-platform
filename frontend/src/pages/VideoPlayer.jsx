import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Plus, 
  Play,
  CheckCircle,
  FileText,
  Bookmark,
  MessageSquare,
  Award,
  X,
  Printer
} from 'lucide-react';
import { api, useStore } from '../store/useStore';
import CustomPlayer from '../components/CustomPlayer';

export default function VideoPlayer() {
  const { id } = useParams();
  const { user, addToast } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  
  // Tabs and inputs
  const [activeTab, setActiveTab] = useState('summary');
  const [newComment, setNewComment] = useState('');
  const [note, setNote] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  
  const playerRef = useRef(null);

  // Load Video details & initialize notes
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/videos/${id}`);
        setVideoData(res.data);
        setBookmarks(res.data.video.bookmarks || []);

        const savedNote = localStorage.getItem(`lms_note_${id}`) || '';
        setNote(savedNote);
      } catch (err) {
        console.error(err);
        addToast('Failed to load video details', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setNote(text);
    localStorage.setItem(`lms_note_${id}`, text);
  };

  const addBookmark = async () => {
    try {
      const activeSeconds = localStorage.getItem(`lms_last_sec_${id}`) || 0;
      const timestamp = parseFloat(activeSeconds);

      const res = await api.post('/videos/bookmarks', {
        videoId: id,
        timestamp
      });
      
      setBookmarks([...bookmarks, res.data]);
      addToast('Bookmark saved successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to save bookmark', 'danger');
    }
  };

  const deleteBookmark = async (bId) => {
    try {
      await api.delete(`/videos/bookmarks/${bId}`);
      setBookmarks(bookmarks.filter(b => b.id !== bId));
      addToast('Bookmark removed', 'info');
    } catch (err) {
      console.error(err);
      addToast('Failed to remove bookmark', 'danger');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post('/videos/comments', {
        videoId: id,
        message: newComment
      });

      setVideoData(prev => ({
        ...prev,
        video: {
          ...prev.video,
          comments: [res.data, ...prev.video.comments]
        }
      }));
      setNewComment('');
      addToast('Comment posted', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to post comment', 'danger');
    }
  };

  const handleProgressUpdate = (progressData) => {
    localStorage.setItem(`lms_last_sec_${id}`, progressData.progress.currentTime);
  };

  const handleCompleted = (completionData) => {
    addToast('Video lesson completed successfully!', 'success');
    setShowCertificateModal(true);
    
    api.get(`/videos/${id}`).then(res => {
      setVideoData(prev => ({
        ...prev,
        video: {
          ...prev.video,
          progress: res.data.video.progress
        }
      }));
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-neutral-300 rounded-sm border border-[#d2d6dc]" />
          <div className="h-6 bg-neutral-300 rounded w-1/2" />
          <div className="h-24 bg-neutral-300 rounded-sm border border-[#d2d6dc]" />
        </div>
        <div className="h-80 bg-neutral-300 rounded-sm border border-[#d2d6dc]" />
      </div>
    );
  }

  const { video, relatedVideos } = videoData || {};

  const getAISummary = (title) => {
    return (
      <div className="space-y-4 text-xs text-[#2d3748]">
        <div className="flex items-center gap-2 text-[#002c6c] font-bold uppercase tracking-wider text-[11px] font-sans">
          <span>AI Summary Directive Notes</span>
        </div>
        <ul className="list-disc pl-4 text-neutral-600 space-y-2.5 leading-relaxed font-sans">
          <li><strong>Curriculum Scope:</strong> Detailed operational methods and parameters evaluated in the video lesson: <em>"{title}"</em>.</li>
          <li><strong>Technical Core:</strong> Inspect script execution commands, auditing parameters, and terminal logs shown in the catalog.</li>
          <li><strong>Quality Notice:</strong> Verify file permissions, configuration routes, and schema structures before deployment.</li>
          <li><strong>Study Milestone:</strong> Re-examine note entries and continue to the next lecture in the directory list.</li>
        </ul>
      </div>
    );
  };

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60);
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16 font-sans text-[#2d3748]">
      
      {/* Left Column: Player & Tabs */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Custom player */}
        <CustomPlayer 
          video={video} 
          onProgressUpdate={handleProgressUpdate} 
          onCompleted={handleCompleted}
        />

        {/* Video metadata */}
        <div className="bg-white border border-[#cbd5e0] rounded-sm p-5 space-y-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase bg-[#f0f4f8] text-[#002c6c] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                {video.category}
              </span>
              <span className="text-[10px] font-bold uppercase bg-[#f0f4f8] text-[#002c6c] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                {video.difficulty}
              </span>
            </div>
            
            {video.progress?.completed && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="btn-gold py-1.5 px-3 text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#002c6c] transition-all hover:scale-102"
              >
                <Award className="w-3.5 h-3.5 text-[#002c6c]" /> Claim Certificate
              </button>
            )}
          </div>

          <h2 className="text-lg font-serif font-bold text-[#002c6c] tracking-tight">
            {video.title}
          </h2>

          <p className="text-neutral-500 text-xs leading-normal">
            {video.description}
          </p>
        </div>

        {/* Dossier Tabs */}
        <div className="border border-[#cbd5e0] bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="flex border-b border-[#cbd5e0] bg-[#f8fafc] px-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'summary', label: 'AI Summary', icon: FileText },
              { id: 'notes', label: 'My Notes Dossier', icon: FileText },
              { id: 'bookmarks', label: 'Checkpoints', icon: Bookmark },
              { id: 'comments', label: 'Discussion Log', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-4 outline-none cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                    activeTab === tab.id 
                      ? 'border-[#002c6c] text-[#002c6c] bg-white' 
                      : 'border-transparent text-neutral-500 hover:text-[#002c6c]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-5 min-h-[200px]">
            {activeTab === 'summary' && (
              <div>
                {getAISummary(video.title)}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="text-[10px] font-mono text-neutral-550 uppercase tracking-wider font-semibold">Workspace Study Notes (Auto-saved)</div>
                <textarea
                  placeholder="Record study log directives, codes, or terminal summaries here..."
                  value={note}
                  onChange={handleNoteChange}
                  className="w-full h-36 p-3.5 rounded-sm bg-white border border-[#c3c8cf] text-xs text-[#1a202c] placeholder-neutral-500 focus:border-[#002c6c] focus:ring-1 focus:ring-[#002c6c] outline-none resize-none transition-colors"
                />
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-550 uppercase font-semibold">Dossier Bookmark</span>
                  <button
                    onClick={addBookmark}
                    className="btn-gold px-2.5 py-1 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Log Current Time
                  </button>
                </div>
                
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {bookmarks.map((b) => (
                      <div key={b.id} className="flex justify-between items-center p-2.5 rounded-sm border border-[#cbd5e0] bg-[#f8fafc] hover:border-[#b1b7c1] transition-colors">
                        <span className="text-xs font-semibold text-[#002c6c] font-mono">
                          Timestamp: {formatTime(b.timestamp)}
                        </span>
                        <button
                          onClick={() => deleteBookmark(b.id)}
                          className="text-xs text-red-650 hover:text-red-750 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-500 text-xs">
                    No study checkpoints saved.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Submit inquiry or study comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="form-input text-xs"
                  />
                  <button
                    type="submit"
                    className="btn-primary py-1 px-3.5 text-xs"
                  >
                    Submit
                  </button>
                </form>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {video.comments?.length > 0 ? (
                    video.comments.map((comm) => (
                      <div key={comm.id} className="p-3 bg-[#f8fafc] border border-[#cbd5e0] rounded-sm text-xs space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-500 font-mono font-semibold">
                          <span className="text-[#002c6c]">{comm.user.name}</span>
                          <span>{new Date(comm.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#2d3748] leading-normal">{comm.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-neutral-500 text-xs">
                      No student inquiries posted yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Lessons Sidebar */}
      <div className="space-y-6">
        <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white space-y-5 shadow-sm">
          {/* Header */}
          <div className="pb-3 border-b border-[#cbd5e0] space-y-2">
            <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider">Course Curriculum</h3>
            
            {/* Overall Course Progress */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-neutral-550 font-bold">
                <span>Course Completion</span>
                <span>{Math.round((([video, ...relatedVideos].filter(l => l.progress?.completed).length) / ([video, ...relatedVideos].length)) * 100 || 0)}%</span>
              </div>
              <div className="w-full bg-[#e2e8f0] h-2 rounded-sm overflow-hidden border border-[#cbd5e0]">
                <div 
                  className="bg-[#002c6c] h-full transition-all" 
                  style={{ width: `${Math.round((([video, ...relatedVideos].filter(l => l.progress?.completed).length) / ([video, ...relatedVideos].length)) * 100 || 0)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lesson Checklist */}
          <div className="space-y-2.5">
            {[video, ...relatedVideos]
              .sort((a, b) => a.id - b.id)
              .map((item) => {
                const isActive = item.id === video.id;
                const isCompleted = item.progress?.completed;
                
                return (
                  <Link 
                    key={item.id}
                    to={`/video/${item.id}`}
                    className={`p-3 rounded-sm border flex items-center justify-between gap-3 transition-colors block text-xs ${
                      isActive 
                        ? 'border-l-4 border-l-[#002c6c] border-[#cbd5e0] bg-[#f0f4f8] font-bold text-[#002c6c]' 
                        : 'border-[#cbd5e0] bg-white hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Status Icon */}
                      <span className="flex-shrink-0 select-none">
                        {isActive ? (
                          <span className="text-[#002c6c] font-bold">▶</span>
                        ) : isCompleted ? (
                          <span className="text-emerald-600 font-bold">✓</span>
                        ) : (
                          <span className="text-neutral-400 font-bold">□</span>
                        )}
                      </span>
                      
                      <span className="truncate">{item.title}</span>
                    </div>
                    
                    <span className="text-[10px] font-mono text-neutral-500 flex-shrink-0">
                      {formatTime(item.duration)}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      {/* Rajasthan Gov certificate print view modal */}

    {showCertificateModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="relative w-full max-w-xl bg-white border border-[#cbd5e0] p-8 rounded-sm shadow-2xl space-y-6">
          {/* Close */}
          <button 
            onClick={() => setShowCertificateModal(false)}
            className="absolute top-4 right-4 text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Certificate content - formal navy gold print document */}
          <div className="certificate-print-container border-4 border-[#002c6c] bg-white p-8 space-y-6 text-center rounded-sm relative">
            {/* Decorative Gold corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#f2a900]"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#f2a900]"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#f2a900]"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#f2a900]"></div>

            <div className="flex justify-center mb-2">
              <img src="/rajasthan_logo.png" alt="Government of Rajasthan Logo" className="w-16 h-16 object-contain" />
            </div>

            <h2 className="text-lg font-serif font-bold tracking-widest text-[#002c6c] uppercase">Government of Rajasthan</h2>
            <p className="text-[9px] font-sans text-neutral-500 uppercase tracking-widest font-bold">Department of Information Technology & Communication</p>
            
            <div className="h-0.5 bg-[#f2a900] w-20 mx-auto my-2" />
            
            <p className="text-[10px] font-sans text-[#718096] uppercase tracking-wider">Official Certificate of Course Completion</p>
            
            <h1 className="text-2xl font-serif font-bold text-[#002c6c] underline underline-offset-4 decoration-[#f2a900] decoration-2">{user?.name}</h1>
            
            <p className="text-xs text-[#4a5568] max-w-sm mx-auto leading-relaxed">
              has successfully completed all required modules, passed validation checks, and satisfied study compliance hours for the technology track:
            </p>
            
            <div className="p-2.5 rounded-sm bg-[#f0f4f8] border border-[#cbd5e0] inline-block">
              <span className="text-xs font-serif font-bold text-[#002c6c] uppercase">
                {video.category === 'Artificial Intelligence' ? 'Artificial Intelligence Core & Neural Systems' : 'Cybersecurity Defense Penetration Frameworks'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 max-w-sm mx-auto text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider">
              <div className="border-t border-[#cbd5e0] pt-2">
                DIRECTOR, DOIT&C
              </div>
              <div className="border-t border-[#cbd5e0] pt-2">
                STATE COORDINATOR
              </div>
            </div>
          </div>

          {/* Print button */}
          <button 
            onClick={() => window.print()}
            className="btn-gold w-full py-2.5 flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs font-bold text-[#002c6c]"
          >
            <Printer className="w-4 h-4 text-[#002c6c]" /> Print Official Credential
          </button>
        </div>
      </div>
    )}
    
  </div>
);
}
