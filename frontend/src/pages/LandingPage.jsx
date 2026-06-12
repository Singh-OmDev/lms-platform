import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Cpu, 
  Compass, 
  ArrowRight, 
  CheckCircle,
  FileCode,
  Users,
  Video,
  FileText
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LandingPage() {
  const { isAuthenticated } = useStore();
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

  return (
    <div className="bg-[#f0f4f8] text-[#1a202c] min-h-screen selection:bg-[#cbd5e0] selection:text-black font-sans flex flex-col">
      {/* Official Government Banner */}
      <div className="bg-[#e2e8f0] border-b border-[#cbd5e0] px-6 py-1.5 text-[11px] text-[#4a5568] flex items-center space-x-2 select-none">
        <span className="inline-block w-4 h-2.5 bg-sky-600 border border-white"></span>
        <span>An official website of the Government of Rajasthan • DoIT&C</span>
      </div>

      {/* Navy Top Header */}
      <nav className="border-b-4 border-[#f2a900] bg-[#002c6c] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/rajasthan_logo.png" 
              alt="Rajasthan Government Emblem" 
              className="w-9 h-9 object-contain bg-white rounded-full p-0.5 border border-[#f2a900] transition-transform group-hover:scale-105" 
            />
            <div>
              <span className="text-[9px] font-bold text-[#f2a900] uppercase tracking-wider block">Government of Rajasthan</span>
              <span className="font-serif font-bold text-base tracking-wide text-white transition-colors group-hover:text-neutral-200 block">
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
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 flex flex-col items-center text-center">
        {/* Portal Notice Flag */}
        <div className="inline-flex items-center space-x-2 bg-white border border-[#d2d6dc] rounded-sm px-4 py-1.5 text-xs text-[#002c6c] font-medium shadow-sm mb-6 select-none">
          <FileText className="w-4 h-4 text-[#f2a900]" />
          <span>Agency Authorized Compliance Curriculum</span>
        </div>
        
        {/* Serif Formal Title */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#002c6c] max-w-3xl leading-tight mb-5">
          Rajasthan Portal for Artificial Intelligence and Cybersecurity Training
        </h1>
        
        {/* Informative Subtitle */}
        <p className="text-[#4a5568] text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
          Authorized by the Department of Information Technology & Communication. Access video lectures, manage course paths, log compliance watch time, and record notes within a secure workspace dossier.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary px-6 py-3 flex items-center gap-2">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary px-6 py-3 flex items-center gap-2">
                Register for Courses <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3">
                Public Course Directory
              </Link>
            </>
          )}
        </div>

        {/* Student Transcript Registry Mockup */}
        <div className="w-full max-w-3xl border border-[#d2d6dc] bg-white rounded-sm p-6 text-left shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-[#cbd5e0] mb-5">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#cbd5e0] border border-[#a0aec0]" />
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-semibold">Record ID: NTS-2026-ML</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">Student Progress Registry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              <div className="border border-[#d2d6dc] bg-[#f8fafc] p-4 space-y-3 rounded-sm">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">Current Enrolled Domain</span>
                <div>
                  <h3 className="text-[#002c6c] font-serif font-bold text-sm">Deep Learning & Neural Networks</h3>
                  <div className="w-full bg-[#e2e8f0] h-2.5 rounded-sm overflow-hidden mt-2.5 border border-[#cbd5e0]">
                    <div className="bg-[#002c6c] h-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 font-semibold">
                  <span>65% Requirement Fulfilled</span>
                  <span>4 / 6 Modules Enrolled</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#d2d6dc] bg-[#f8fafc] p-4 rounded-sm">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">Logged Study Hours</span>
                  <div className="text-base font-mono font-bold text-[#002c6c] mt-1">12h 45m</div>
                </div>
                <div className="border border-[#d2d6dc] bg-[#f8fafc] p-4 rounded-sm">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">Course Certificates</span>
                  <div className="text-base font-mono font-bold text-[#002c6c] mt-1">2 Issued</div>
                </div>
              </div>
            </div>

            {/* Registry Checklist */}
            <div className="border border-[#d2d6dc] bg-[#f8fafc] p-4 rounded-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">Portal Compliance Check</span>
                <div className="space-y-2.5 text-xs text-[#2d3748]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Watch Progress Saved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Scratchpad Enabled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Verification Seal Active</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#cbd5e0] text-center text-[9px] font-mono text-[#718096]">
                Data backed by secure ledger
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bulletins */}
      <section className="border-t border-[#d2d6dc] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-serif font-bold text-[#002c6c] mb-3">
              Official Capabilities and System Directives
            </h2>
            <p className="text-[#4a5568] text-xs sm:text-sm">
              Review platform requirements, learning pathways, and progress monitoring capabilities managed under security directives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {directives.map((dir, idx) => {
              const Icon = dir.icon;
              return (
                <div key={idx} className="border border-[#d2d6dc] bg-[#f8fafc] p-5 rounded-sm hover:border-[#b1b7c1] hover:shadow-sm transition-all">
                  <div className="w-8 h-8 rounded bg-white border border-[#cbd5e0] flex items-center justify-center mb-3.5">
                    <Icon className="w-4 h-4 text-[#002c6c]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs text-[#002c6c] mb-2">{dir.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{dir.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum directives circular */}
      <section className="border-t border-[#d2d6dc] bg-[#f8fafc] py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#002c6c] leading-tight">
              Administrative Dossier Management and Reporting
            </h2>
            <p className="text-[#4a5568] text-xs sm:text-sm leading-relaxed">
              If logged in as a compliance instructor, the platform provides dashboard interfaces to track student completion metrics, manage active directories, upload training videos, and adjust difficulty descriptors.
            </p>
            <div className="space-y-3 pt-1 text-xs text-[#2d3748]">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#002c6c]">Student Completion Audit</h4>
                  <p className="text-neutral-500 mt-0.5">Logs progress percentages for all enrollees, compiling reports on overall platform metrics.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#002c6c]">Public Video Directory</h4>
                  <p className="text-neutral-500 mt-0.5">Videos are organized cleanly under categories (AI and Cybersecurity) for direct access.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Statistics block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#d2d6dc] bg-white rounded-sm p-5 shadow-sm text-center">
              <div className="text-xl font-mono font-bold text-[#002c6c] mb-1">98.4%</div>
              <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">completion rate</div>
            </div>
            <div className="border border-[#d2d6dc] bg-white rounded-sm p-5 shadow-sm text-center">
              <div className="text-xl font-mono font-bold text-[#002c6c] mb-1">10s</div>
              <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">sync interval</div>
            </div>
            <div className="border border-[#d2d6dc] bg-white rounded-sm p-5 shadow-sm text-center">
              <div className="text-xl font-mono font-bold text-[#002c6c] mb-1">12K+</div>
              <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">enrolled students</div>
            </div>
            <div className="border border-[#d2d6dc] bg-white rounded-sm p-5 shadow-sm text-center">
              <div className="text-xl font-mono font-bold text-[#002c6c] mb-1">Secure</div>
              <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">data logs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Navy Footer */}
      <footer className="border-t border-[#cbd5e0] bg-[#001f4d] py-12 text-white text-xs mt-auto font-sans">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#002c6c]">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <img src="/rajasthan_logo.png" alt="Government of Rajasthan Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 border border-[#f2a900]" />
                <span className="font-serif font-bold tracking-wide text-sm">AI & Cyber Security Hub</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                An official education & compliance repository managed by the Department of Information Technology & Communication, Government of Rajasthan.
              </p>
            </div>
            <div className="space-y-2.5">
              <h4 className="font-semibold text-[#f2a900] uppercase tracking-wider text-[10px]">Portal Directories</h4>
              <ul className="space-y-1.5 text-neutral-300">
                <li><a href="#" className="hover:text-white">Government Circulars</a></li>
                <li><a href="#" className="hover:text-white">Compliance Guidelines</a></li>
                <li><a href="#" className="hover:text-white">Privacy Statement</a></li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="font-semibold text-[#f2a900] uppercase tracking-wider text-[10px]">Contact desk</h4>
              <p className="text-neutral-300">Support Desk: 1800-DOIT-RAJS</p>
              <p className="text-neutral-400">Email: support.lms@rajasthan.gov.in</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-400">
            <span>© 2026 Department of IT & Communication, Government of Rajasthan. Official Portal.</span>
            <div className="flex space-x-5">
              <a href="#" className="hover:text-white">Accessibility Desk</a>
              <a href="#" className="hover:text-white">RTI Request</a>
              <a href="#" className="hover:text-white">Platform Disclaimers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
