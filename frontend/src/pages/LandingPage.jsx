import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Cpu, Compass, ArrowRight, CheckCircle, FileCode, Users, Video, FileText,
  Clock, Award, Activity, ChevronRight, Mail, Phone, MapPin, Sparkles, BookOpen, AlertTriangle
} from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function LandingPage() {
  const { isAuthenticated } = useStore();
  const [recentArticles, setRecentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        setLoadingArticles(true);
        // Fetch public articles
        const res = await api.get('/articles');
        setRecentArticles(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing page articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchRecentArticles();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !subscribeEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
  };

  const directives = [
    {
      icon: Cpu,
      title: "Directive 101: Artificial Intelligence Core",
      description: "Access certified training curriculum covering neural networks, deep learning models, and data pipelines."
    },
    {
      icon: Shield,
      title: "Directive 102: Infrastructure & Penetration Defense",
      description: "Learn system auditing, pen-testing metrics, network protocol verification, and cloud security frameworks."
    },
    {
      icon: Compass,
      title: "Directive 103: Automated Study Registry",
      description: "Playback state saves current timestamps to the security database automatically at 10-second intervals."
    },
    {
      icon: FileCode,
      title: "Directive 104: Workspace Notes Scratchpad",
      description: "Take persistent notes and document code snippets directly alongside video playback streams."
    },
    {
      icon: Users,
      title: "Directive 105: Instructor Administration",
      description: "Instructors can audit progress compliance, append new video files, and adjust curriculum parameters."
    },
    {
      icon: Video,
      title: "Directive 106: HD Lecture Catalog",
      description: "Stream high-definition lecture assets built to support agency compliance training."
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#07172A] text-slate-800 dark:text-slate-100 min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#0A2540] font-sans flex flex-col transition-colors duration-200">
      
      {/* Official Government Banner */}
      <div className="bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 px-6 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 flex items-center space-x-2 select-none font-medium">
        <span className="inline-block w-4 h-2.5 bg-sky-600 border border-white"></span>
        <span>An official website of the Government of Rajasthan • Department of IT & Communication (DoIT&C)</span>
      </div>

      {/* Navy Top Header */}
      <nav className="sticky top-0 z-50 border-b-4 border-[#D4AF37] bg-[#0A2540] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/rajasthan_logo.png" 
              alt="Rajasthan Government Emblem" 
              className="w-10 h-10 object-contain bg-white rounded-full p-0.5 border border-[#D4AF37] transition-transform group-hover:scale-105" 
            />
            <div>
              <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider block">Government of Rajasthan</span>
              <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-white transition-colors group-hover:text-neutral-200 block">
                AI & Cyber Security Hub
              </span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-gold px-4 py-2 text-xs font-semibold">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-gold px-4 py-2 text-xs font-semibold">
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0F1E36] to-[#051321] text-white py-16 md:py-24 border-b border-slate-800">
        {/* Abstract Tech Mask Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#132b4b_1px,transparent_1px),linear-gradient(to_bottom,#132b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Portal Notice Flag */}
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-[#D4AF37] font-semibold backdrop-blur-md shadow-sm select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>State Authorized Cybersecurity & AI Curriculum</span>
          </div>
          
          {/* Serif Formal Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold max-w-4xl leading-tight text-white tracking-tight">
            Rajasthan Portal for Artificial Intelligence and Cybersecurity Training
          </h1>
          
          {/* Informative Subtitle */}
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Committed to preparing state administrative personnel, IT officers, and public students with verified technical knowledge. Monitor study time, log metrics, and claim Rajasthan Gov compliance credentials.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-gold px-6 py-3 flex items-center gap-2 text-xs">
                Go to Dashboard <ArrowRight className="w-4 h-4 text-[#0A2540]" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-gold px-6 py-3 flex items-center gap-2 text-xs text-[#0A2540]">
                  Register for Courses <ArrowRight className="w-4 h-4 text-[#0A2540]" />
                </Link>
                <Link to="/login" className="bg-white/10 hover:bg-white/15 border border-white/20 px-6 py-3 text-xs font-semibold rounded-md transition-colors">
                  Compliance Login Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Student Transcript Registry Mockup */}
      <section className="max-w-5xl mx-auto px-6 -translate-y-8 z-20 w-full">
        <div className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E2035] rounded-md p-6 text-left shadow-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-5">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">System Registry: Active Sync</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Database Ledger</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] p-4 space-y-3 rounded-md">
                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Standard Syllabus Enrolled</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[#0A2540] dark:text-[#D4AF37] font-serif font-bold text-sm">Deep Learning & Cybersecurity Core</h3>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-sm overflow-hidden mt-2 border border-slate-300 dark:border-slate-700">
                      <div className="bg-[#0A2540] dark:bg-[#D4AF37] h-full transition-all" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap text-right">
                    <span>75% Compliance Reached</span>
                    <br />
                    <span>5 of 6 Modules Completed</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] p-4 rounded-md">
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Total Platform Hours</span>
                  <div className="text-lg font-mono font-bold text-[#0A2540] dark:text-white mt-1">45h 12m</div>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] p-4 rounded-md">
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Verifiable Certificates</span>
                  <div className="text-lg font-mono font-bold text-[#0A2540] dark:text-white mt-1">2 Issued</div>
                </div>
              </div>
            </div>

            {/* Registry Checklist */}
            <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] p-4 rounded-md flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Audit Requirements</span>
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <span>Progress Saved to Cloud</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <span>Scratchpad Workspace Live</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <span>Verification Seal Authenticated</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[9px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                DoIT&C Registrar Ledger
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bulletins */}
      <section className="bg-white dark:bg-[#07172A] border-b border-slate-200 dark:border-slate-800 transition-colors py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A2540] dark:text-[#D4AF37] mb-2">
              Capabilities & Directives Directory
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
              Review course directives and technical capabilities integrated into this compliance training registry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directives.map((dir, idx) => {
              const Icon = dir.icon;
              return (
                <div key={idx} className="premium-card p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-9 h-9 rounded bg-[#F8FAFC] dark:bg-[#0C1E32] border border-slate-250 dark:border-slate-800 flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4 text-[#0A2540] dark:text-[#D4AF37]" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#0A2540] dark:text-white mb-2">{dir.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{dir.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Technical Bulletins & Publications Feed */}
      <section className="bg-[#F8FAFC] dark:bg-[#0C1E32] border-b border-slate-200 dark:border-slate-800 py-16 transition-colors">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A2540] dark:text-[#D4AF37] mb-2">
                Technical Bulletins & Publications
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Official regulatory warnings, technological circulars, and cyber-security audits from DoIT&C.
              </p>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#0E2035] border border-slate-250 dark:border-slate-800 hover:border-[#D4AF37]/50 rounded-md text-xs font-bold text-[#0A2540] dark:text-white shadow-sm transition-colors cursor-pointer"
            >
              Browse All Circulars <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          ) : recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentArticles.map((art) => (
                <div
                  key={art.id}
                  className="group flex flex-col justify-between bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 hover:border-[#D4AF37]/50 rounded-md shadow-sm overflow-hidden hover-glow hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="h-36 relative bg-slate-900 overflow-hidden">
                      <img
                        src={art.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'}
                        alt={art.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-slate-900/60 text-[#D4AF37] border border-[#D4AF37]/40 rounded-sm">
                        {art.category}
                      </span>
                    </div>

                    <div className="px-5 pb-2 space-y-2">
                      <div className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                        <span>{art.author?.name || 'DoIT&C Admin'}</span>
                        <span>•</span>
                        <span>{formatDate(art.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#0A2540] dark:text-white line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                        <Link to={isAuthenticated ? `/blogs/${art.id}` : '/login'}>{art.title}</Link>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-between items-center text-[11px] font-bold">
                    <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.max(1, Math.ceil((art.content?.split(/\s+/).length || 0) / 200))} min read
                    </span>
                    <Link
                      to={isAuthenticated ? `/blogs/${art.id}` : '/login'}
                      className="text-[#0A2540] dark:text-[#D4AF37] hover:underline flex items-center gap-0.5"
                    >
                      Read circular <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-[#0E2035] border border-slate-200 dark:border-slate-800 rounded-md">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No recent bulletins have been published yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Curriculum reporting descriptors */}
      <section className="bg-white dark:bg-[#07172A] py-16 transition-colors">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A2540] dark:text-[#D4AF37] leading-tight">
              Administrative Dossier Management & Regulatory Compliance
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              If authenticated as a security compliance administrator, the LMS provides dashboard modules to compile student statistics, manage lessons, review streaks syncs, and publish urgent state bulletins.
            </p>
            <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0A2540] dark:text-white">Continuous Compliance Monitoring</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Logs progress percentages for all enrollees, compiling reports on overall platform metrics.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0A2540] dark:text-white">Active Video/Lecture Repository</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Lectures are dynamically categorized (AI or Cyber Security) for simplified access.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Statistics block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] rounded-md p-5 shadow-sm text-center">
              <div className="text-2xl font-mono font-bold text-[#0A2540] dark:text-[#D4AF37] mb-1">98.4%</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">completion rate</div>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] rounded-md p-5 shadow-sm text-center">
              <div className="text-2xl font-mono font-bold text-[#0A2540] dark:text-[#D4AF37] mb-1">10s</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">sync interval</div>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] rounded-md p-5 shadow-sm text-center">
              <div className="text-2xl font-mono font-bold text-[#0A2540] dark:text-[#D4AF37] mb-1">12K+</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">enrolled students</div>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C1E32] rounded-md p-5 shadow-sm text-center">
              <div className="text-2xl font-mono font-bold text-[#0A2540] dark:text-[#D4AF37] mb-1">Secure</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">data logs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Government 4-Column Footer */}
      <footer className="border-t border-slate-300 dark:border-slate-800 bg-[#071A2E] py-16 text-white text-xs font-sans">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Col 1: Branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <img src="/rajasthan_logo.png" alt="Government of Rajasthan Logo" className="w-9 h-9 object-contain bg-white rounded-full p-0.5 border border-[#D4AF37]" />
                <div>
                  <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-wider block">State Portal</span>
                  <span className="font-serif font-bold tracking-wide text-sm text-white">AI & Cyber Hub</span>
                </div>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Official compliance registry and education resource portal managed by the Department of Information Technology & Communication (DoIT&C), Government of Rajasthan.
              </p>
            </div>
            
            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">Administrative Links</h4>
              <ul className="space-y-2 text-gray-300 text-[11px]">
                <li><a href="#" className="hover:text-white transition-colors">Official Gazettes & Circulars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">RTI Request Submission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance Audit Logs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility Guidelines</a></li>
              </ul>
            </div>
            
            {/* Col 3: Support Contact */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">Helpdesk & Contacts</h4>
              <div className="space-y-2 text-gray-300 text-[11px]">
                <p><strong>Support Desk:</strong> 1800-DOIT-RAJS</p>
                <p><strong>Email Desk:</strong> support.lms@rajasthan.gov.in</p>
                <p className="text-gray-400 leading-normal">
                  IT Building, Yojana Bhawan, Tilak Marg, C-Scheme, Jaipur, Rajasthan 302005
                </p>
              </div>
            </div>
            
            {/* Col 4: Interactive alerts form */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">Compliance Bulletins</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Subscribe to receive urgent cyber alerts and official technological circulars directly in your inbox.
              </p>
              
              {subscribed ? (
                <div className="p-3 bg-[#0a2540]/60 border border-emerald-500/30 rounded-md text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
                  <span>✓ Subscribed to bulletins successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-gray-500 outline-none focus:border-[#D4AF37] flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Footer Sub-links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
            <span>© 2026 Department of IT & Communication, Government of Rajasthan. Official Portal.</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">State Disclaimers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
