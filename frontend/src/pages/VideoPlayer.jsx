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
import { useTranslation } from '../utils/translations';

export default function VideoPlayer() {
  const { id } = useParams();
  const { user, addToast } = useStore();
  const { t } = useTranslation();
  
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
    addToast('Video lesson completed successfully! Head to the Certificates Center to take the assessment.', 'success');
    
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
        <div className="flex items-center gap-2 text-[#0A2540] font-bold uppercase tracking-wider text-[11px] font-sans">
          <span>{t('video.aiSummary')}</span>
        </div>
        <ul className="list-disc pl-4 text-neutral-650 space-y-2.5 leading-relaxed font-sans">
          <li><strong>{t('video.scope')}</strong> {t('video.scopeDesc')} <em>"{title}"</em>.</li>
          <li><strong>{t('video.techCore')}</strong> {t('video.techCoreDesc')}</li>
          <li><strong>{t('video.qualityNotice')}</strong> {t('video.qualityNoticeDesc')}</li>
          <li><strong>{t('video.milestone')}</strong> {t('video.milestoneDesc')}</li>
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
              <span className="text-[10px] font-bold uppercase bg-[#f0f4f8] text-[#0A2540] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                {video.category}
              </span>
              <span className="text-[10px] font-bold uppercase bg-[#f0f4f8] text-[#0A2540] px-2 py-0.5 rounded-sm border border-[#cbd5e0]">
                {video.difficulty}
              </span>
            </div>
            
            {video.progress?.completed && (
              <Link
                to="/certificates"
                className="btn-gold py-1.5 px-3 text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0A2540] transition-all hover:scale-102"
              >
                <Award className="w-3.5 h-3.5 text-[#0A2540]" /> Go to Certificates Center
              </Link>
            )}
          </div>

          <h2 className="text-lg font-serif font-bold text-[#0A2540] tracking-tight">
            {video.title}
          </h2>

          <p className="text-neutral-550 text-xs leading-normal">
            {video.description}
          </p>
        </div>

        {/* Dossier Tabs */}
        <div className="border border-[#cbd5e0] bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="flex border-b border-[#cbd5e0] bg-[#f8fafc] px-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'summary', label: t('video.aiSummaryTab'), icon: FileText },
              { id: 'notes', label: t('video.myNotesTab'), icon: FileText },
              { id: 'bookmarks', label: t('video.checkpointsTab'), icon: Bookmark },
              { id: 'comments', label: t('video.discussionTab'), icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-4 outline-none cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                    activeTab === tab.id 
                      ? 'border-[#0A2540] text-[#0A2540] bg-white' 
                      : 'border-transparent text-neutral-550 hover:text-[#0A2540]'
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
                <div className="text-[10px] font-mono text-neutral-550 uppercase tracking-wider font-semibold">{t('video.autoSaved')}</div>
                <textarea
                  placeholder={t('video.notesPlaceholder')}
                  value={note}
                  onChange={handleNoteChange}
                  className="w-full h-36 p-3.5 rounded-sm bg-white border border-[#c3c8cf] text-xs text-[#1a202c] placeholder-neutral-500 focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540] outline-none resize-none transition-colors"
                />
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-550 uppercase font-semibold">{t('video.bookmarkDossier')}</span>
                  <button
                    onClick={addBookmark}
                    className="btn-gold px-2.5 py-1 text-[10px] flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Plus className="w-3 h-3" /> {t('video.logCurrentTime')}
                  </button>
                </div>
                
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {bookmarks.map((b) => (
                      <div key={b.id} className="flex justify-between items-center p-2.5 rounded-sm border border-[#cbd5e0] bg-[#f8fafc] hover:border-[#b1b7c1] transition-colors">
                        <span className="text-xs font-semibold text-[#0A2540] font-mono">
                          {t('video.timestamp')}: {formatTime(b.timestamp)}
                        </span>
                        <button
                          onClick={() => deleteBookmark(b.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
                        >
                          {t('video.delete')}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-550 text-xs">
                    {t('video.noCheckpoints')}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('video.commentPlaceholder')}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="form-input text-xs"
                  />
                  <button
                    type="submit"
                    className="btn-primary py-1 px-3.5 text-xs font-bold"
                  >
                    {t('video.submit')}
                  </button>
                </form>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {video.comments?.length > 0 ? (
                    video.comments.map((comm) => (
                      <div key={comm.id} className="p-3 bg-[#f8fafc] border border-[#cbd5e0] rounded-sm text-xs space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-500 font-mono font-semibold">
                          <span className="text-[#0A2540]">{comm.user.name}</span>
                          <span>{new Date(comm.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#2d3748] leading-normal">{comm.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-neutral-550 text-xs">
                      {t('video.noInquiries')}
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
            <h3 className="font-serif font-bold text-xs text-[#0A2540] uppercase tracking-wider">{t('video.curriculum')}</h3>
            
            {/* Overall Course Progress */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-neutral-555 font-bold">
                <span>{t('video.completion')}</span>
                <span>{Math.round((([video, ...relatedVideos].filter(l => l.progress?.completed).length) / ([video, ...relatedVideos].length)) * 100 || 0)}%</span>
              </div>
              <div className="w-full bg-[#e2e8f0] h-2 rounded-sm overflow-hidden border border-[#cbd5e0]">
                <div 
                  className="bg-[#0A2540] h-full transition-all" 
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
                        ? 'border-l-4 border-l-[#0A2540] border-[#cbd5e0] bg-[#f0f4f8] font-bold text-[#0A2540]' 
                        : 'border-[#cbd5e0] bg-white hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Status Icon */}
                      <span className="flex-shrink-0 select-none">
                        {isActive ? (
                          <span className="text-[#0A2540] font-bold">{t('video.play')}</span>
                        ) : isCompleted ? (
                          <span className="text-emerald-600 font-bold">{t('video.check')}</span>
                        ) : (
                          <span className="text-neutral-450 font-bold">{t('video.box')}</span>
                        )}
                      </span>
                      
                      <span className="truncate">{item.title}</span>
                    </div>
                    
                    <span className="text-[10px] font-mono text-neutral-550 flex-shrink-0">
                      {formatTime(item.duration)}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
