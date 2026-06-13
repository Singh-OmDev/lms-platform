import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Shield, Award, BookOpen, ShieldAlert, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function AuthPages({ isRegisterInitial = false }) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const clerkAppearance = {
    variables: {
      colorPrimary: isDark ? '#D4AF37' : '#0A2540',
      colorText: isDark ? '#F1F5F9' : '#1E293B',
      colorTextSecondary: isDark ? '#94A3B8' : '#4A5568',
      colorBackground: isDark ? '#0E2035' : '#FFFFFF',
      colorInputBackground: isDark ? '#0C1E32' : '#F8FAFC',
      colorInputText: isDark ? '#F1F5F9' : '#1E293B',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      borderRadius: '6px',
    },
    elements: {
      card: 'shadow-none border-0 bg-transparent p-0 m-0',
      headerTitle: `font-serif text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-[#0A2540]'}`,
      headerSubtitle: `text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`,
      formButtonPrimary: `${isDark ? 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0A2540] border-[#A88725]' : 'bg-[#0A2540] hover:bg-[#071A2E] text-white border-[#051321]'} border-b-2 text-xs font-bold uppercase tracking-wider py-2.5 shadow-sm active:translate-y-[1px] transition-all cursor-pointer w-full`,
      socialButtonsBlockButton: `border ${isDark ? 'border-[#1E2E44] hover:bg-[#1E2E44] !text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-700'} text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer`,
      formFieldInput: `${isDark ? 'bg-[#0C1E32] border-[#1E2E44] text-white focus:border-[#D4AF37] focus:ring-[#D4AF37]' : 'bg-gray-50 border-gray-300 text-[#1E293B] focus:border-[#0A2540] focus:ring-[#0A2540]'} border focus:ring-1 text-xs rounded-md py-2.5 px-3 transition-all outline-none`,
      formFieldLabel: `text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`,
      footerActionLink: `${isDark ? 'text-[#D4AF37] hover:text-[#C5A059]' : 'text-[#0A2540] hover:text-[#0b48a0]'} font-bold transition-colors`,
      identityPreviewText: `text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`,
      identityPreviewEditButton: 'text-[#D4AF37] hover:text-[#A88725] font-bold',
      formFieldInputShowPasswordButton: `${isDark ? 'text-[#D4AF37] hover:text-[#C5A059]' : 'text-[#0A2540] hover:text-[#071A2E]'} font-bold`,
      dividerText: isDark ? 'text-gray-400' : 'text-gray-500',
      dividerLine: isDark ? 'bg-[#1E2E44]' : 'bg-gray-200',
      socialButtonsBlockButtonText: isDark ? '!text-white font-semibold' : 'text-gray-700 font-semibold',
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans ${isDark ? 'bg-[#0C1E32]' : 'bg-[#F8FAFC]'}`}>
      
      {/* Left Column: Official Branding Banner & Info */}
      <div className="relative md:w-1/2 bg-gradient-to-br from-[#0A2540] via-[#0F1E36] to-[#051321] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
        
        {/* Background Ambient Glows & Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F2E50_1px,transparent_1px),linear-gradient(to_bottom,#0F2E50_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Top Header branding */}
        <div className="relative z-10 flex items-center space-x-3">
          <img 
            src="/rajasthan_logo.png" 
            alt="Government of Rajasthan Emblem" 
            className="w-11 h-11 object-contain bg-white rounded-full p-0.5 border border-[#D4AF37]" 
          />
          <div>
            <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest block">Government of Rajasthan</span>
            <span className="font-serif font-bold text-xs tracking-wider uppercase text-neutral-100">
              Department of IT & Communication
            </span>
          </div>
        </div>

        {/* Center Info bullets */}
        <div className="relative z-10 my-12 md:my-0 space-y-6 max-w-lg">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] bg-white/5 px-2.5 py-1 rounded-sm w-fit border border-[#D4AF37]/25 backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> State Defense Registry
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
            AI & Cyber Security Hub
          </h1>
          <p className="text-xs md:text-sm text-neutral-300 font-medium leading-relaxed">
            Register your administrative dossier to access authorized technological curriculums, cybersecurity guidelines, and official compliance exams.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Feature 1 */}
            <div className="flex gap-3 items-start">
              <div className="p-1.5 bg-white/5 border border-white/10 rounded text-[#D4AF37] mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">State Issued Certificates</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Earn formal technological credentials signed by the Department of IT.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex gap-3 items-start">
              <div className="p-1.5 bg-white/5 border border-white/10 rounded text-[#D4AF37] mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Curated Syllabus Directory</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Master LLM prompt optimization, model evaluation, and advanced security defense checks.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex gap-3 items-start">
              <div className="p-1.5 bg-white/5 border border-white/10 rounded text-[#D4AF37] mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Real-Time Threat Bulletins</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Receive immediate administrative compliance alerts and state security bulletins.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="relative z-10 text-[10px] text-neutral-400 leading-normal pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 DoIT&C, Government of Rajasthan.</span>
          <span>Official Learning Console.</span>
        </div>
      </div>

      {/* Right Column: Authentication Card Wrapper */}
      <div className="md:w-1/2 flex flex-col justify-between p-6 md:p-12">
        {/* Back Link to Landing */}
        <div className="flex justify-between items-center text-xs">
          <Link
            to="/"
            className={`inline-flex items-center gap-1 font-bold ${isDark ? 'text-[#D4AF37] hover:text-[#C5A059]' : 'text-[#0A2540] hover:text-[#0b48a0]'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Portal Homepage
          </Link>
          <span className={`text-[10px] font-mono ${isDark ? 'text-gray-400 bg-slate-800' : 'text-gray-500 bg-gray-150'} font-bold px-2 py-0.5 rounded-sm select-none uppercase tracking-wide`}>
            Secure Entry
          </span>
        </div>

        {/* Clerk Widget */}
        <div className="my-auto py-8 flex justify-center">
          <div className={`w-full max-w-[420px] p-6 sm:p-8 ${isDark ? 'bg-[#0E2035] border-[#1E2E44]' : 'bg-white border-gray-200'} border rounded-md shadow-lg hover-glow transition-all duration-300`}>
            {/* Government Logo inside card */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-[#0C1E32] border-[#1E2E44]' : 'bg-[#F8FAFC] border-gray-250'} border flex items-center justify-center mb-2 shadow-inner`}>
                <Shield className={`w-5 h-5 ${isDark ? 'text-[#D4AF37]' : 'text-[#0A2540]'}`} />
              </div>
              <h2 className={`text-sm font-serif font-bold ${isDark ? 'text-white' : 'text-[#0A2540]'} uppercase tracking-wider`}>
                LMS Credential Console
              </h2>
              <div className="h-[2px] w-12 bg-[#D4AF37] mt-1.5 rounded" />
            </div>

            {isRegisterInitial ? (
              <SignUp 
                routing="path" 
                path="/register" 
                signInUrl="/login" 
                forceRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            ) : (
              <SignIn 
                routing="path" 
                path="/login" 
                signUpUrl="/register" 
                forceRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            )}
          </div>
        </div>

        {/* Footer info links */}
        <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'} text-center flex justify-center space-x-4`}>
          <a href="#" className={`hover:${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>Privacy Charter</a>
          <span>•</span>
          <a href="#" className={`hover:${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>System Disclaimers</a>
          <span>•</span>
          <a href="#" className={`hover:${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>Support Registry</a>
        </div>
      </div>
      
    </div>
  );
}
