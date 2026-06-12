import React, { useEffect, useState } from 'react';
import { Award, Eye, X, Printer, Shield } from 'lucide-react';
import { api, useStore } from '../store/useStore';

export default function ProfilePage() {
  const { user, addToast, updateUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Settings Forms
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Active certificate modal state
  const [viewCertificate, setViewCertificate] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/stats');
        setProfileData(res.data);
      } catch (err) {
        console.error(err);
        addToast('Failed to load profile details', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('Name and email cannot be blank', 'danger');
      return;
    }
    
    updateUser({ name, email });
    addToast('Account profile information updated', 'success');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      addToast('Passwords do not match or are empty', 'danger');
      return;
    }
    setPassword('');
    setConfirmPassword('');
    addToast('Security settings updated successfully', 'success');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-neutral-300 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
          <div className="h-64 bg-neutral-300 rounded-md border border-[#cbd5e0]" />
        </div>
      </div>
    );
  }

  const { stats } = profileData || {};
  const hasAI = stats?.videosCompleted > 0;
  const hasCyber = stats?.videosCompleted > 0;

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      
      {/* Title */}
      <div className="border-b-2 border-[#d2d6dc] pb-4">
        <h1 className="text-xl font-serif font-bold text-[#002c6c] tracking-tight">Portal Dossier Settings</h1>
        <p className="text-neutral-500 text-xs mt-1">
          Review your enrolled details, account type configuration, and course compliance certificates.
        </p>
      </div>

      {/* User Summary Panel */}
      <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[#f2a900] border border-[#d4af37] text-[#002c6c] flex items-center justify-center font-bold text-base uppercase shadow-sm">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#002c6c]">
              {user?.name}
            </h2>
            <p className="text-neutral-500 text-xs mt-0.5">{user?.email} • Enrolled June 2026</p>
            <span className="inline-block mt-2 text-[9px] font-mono uppercase bg-[#f0f4f8] text-[#002c6c] px-1.5 py-0.5 rounded-sm border border-[#cbd5e0]">
              {user?.role} Account Registry
            </span>
          </div>
        </div>

        <div className="flex gap-6 border-t sm:border-t-0 border-[#cbd5e0] pt-4 sm:pt-0">
          <div>
            <span className="text-lg font-mono font-bold text-[#002c6c]">{stats?.videosCompleted || 0}</span>
            <p className="text-[9px] font-bold text-[#4a5568] uppercase mt-0.5">Lessons Completed</p>
          </div>
          <div className="border-l border-[#cbd5e0] pl-6">
            <span className="text-lg font-mono font-bold text-[#002c6c]">{stats?.videosInProgress || 0}</span>
            <p className="text-[9px] font-bold text-[#4a5568] uppercase mt-0.5">In Progress</p>
          </div>
        </div>
      </div>

      {/* Grid Settings Forms & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Profile info */}
          <div className="p-5 bg-white border border-[#cbd5e0] rounded-sm space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider pb-2 border-b border-[#cbd5e0]">General Registry Information</h3>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a5568]">Enrolled Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a5568]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                Save General Updates
              </button>
            </form>
          </div>

          {/* Security updates */}
          <div className="p-5 bg-white border border-[#cbd5e0] rounded-sm space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider pb-2 border-b border-[#cbd5e0]">Change Account Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a5568]">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a5568]">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-secondary"
              >
                Update Access Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Certificates */}
        <div className="space-y-6">
          <div className="p-5 bg-white border border-[#cbd5e0] rounded-sm space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#cbd5e0]">
              <Award className="w-4 h-4 text-[#f2a900]" />
              Compliance Certificates
            </h3>
            
            <div className="space-y-2.5">
              {/* AI Certificate */}
              <div className="p-3 rounded-sm border border-[#cbd5e0] bg-[#f8fafc] flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h4 className="text-xs font-serif font-bold text-[#002c6c] truncate">AI Specialist Track</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Awarded upon AI video modules completion</p>
                </div>
                {hasAI ? (
                  <button 
                    onClick={() => setViewCertificate('ai')}
                    className="btn-primary py-1.5 px-2.5 text-[10px] flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-550 uppercase font-semibold">Locked</span>
                )}
              </div>

              {/* Cyber Certificate */}
              <div className="p-3 rounded-sm border border-[#cbd5e0] bg-[#f8fafc] flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h4 className="text-xs font-serif font-bold text-[#002c6c] truncate">Security Analyst Track</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Awarded upon security modules completion</p>
                </div>
                {hasCyber ? (
                  <button 
                    onClick={() => setViewCertificate('cyber')}
                    className="btn-primary py-1.5 px-2.5 text-[10px] flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-555 uppercase font-semibold">Locked</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate print view modal */}
      {viewCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-xl bg-white border border-[#cbd5e0] p-8 rounded-sm shadow-2xl space-y-6">
            {/* Close */}
            <button 
              onClick={() => setViewCertificate(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black transition-colors"
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
                  {viewCertificate === 'ai' ? 'Artificial Intelligence Core & Neural Systems' : 'Cybersecurity Defense Penetration Frameworks'}
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
