import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Shield, Award, BookOpen, ShieldAlert, ArrowLeft, Lock, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function AuthPages({ isRegisterInitial = false }) {
  const { theme } = useStore();
  const { t } = useTranslation();

  // Clerk appearance — always light inside the card (isolated from dark global CSS)
  const clerkAppearance = {
    variables: {
      colorPrimary: '#0C0E14',
      colorText: '#1E293B',
      colorTextSecondary: '#64748B',
      colorBackground: '#FFFFFF',
      colorInputBackground: '#F8FAFC',
      colorInputText: '#1E293B',
      colorNeutral: '#64748B',
      fontFamily: "'Outfit', system-ui, sans-serif",
      borderRadius: '10px',
      fontSize: '14px',
    },
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 bg-transparent p-0 m-0 w-full',
      headerTitle: 'font-bold text-[#0C0E14] text-[15px] tracking-tight',
      headerSubtitle: 'text-xs text-slate-500 font-medium mt-0.5',
      formButtonPrimary:
        'bg-[#0C0E14] hover:bg-[#1A1E2A] text-white text-xs font-bold uppercase tracking-widest py-3 transition-all cursor-pointer w-full rounded-xl shadow-md active:translate-y-[1px]',
      socialButtonsBlockButton:
        'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer bg-white w-full',
      socialButtonsBlockButtonText: 'text-gray-700 font-semibold text-sm',
      formFieldInput:
        'bg-[#F8FAFC] border border-gray-200 text-[#1E293B] focus:border-[#0C0E14] focus:ring-2 focus:ring-[#0C0E14]/8 text-sm rounded-xl py-3 px-4 transition-all outline-none w-full',
      formFieldLabel: 'text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5',
      footerActionLink: 'text-[#0C0E14] hover:text-[#F5A623] font-bold transition-colors',
      footerActionText: 'text-xs text-gray-500',
      identityPreviewText: 'text-xs font-bold text-gray-700',
      identityPreviewEditButton: 'text-[#0C0E14] hover:text-[#F5A623] font-bold',
      formFieldInputShowPasswordButton: 'text-gray-400 hover:text-[#0C0E14]',
      dividerText: 'text-gray-400 text-xs',
      dividerLine: 'bg-gray-200',
      otpCodeFieldInput: 'border border-gray-200 bg-[#F8FAFC] text-[#1E293B] rounded-xl',
      formResendCodeLink: 'text-[#0C0E14] hover:text-[#F5A623] font-bold',
      alertText: 'text-xs',
      formFieldErrorText: 'text-xs text-red-600',
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[#0C0E14]">

      {/* ─── Left: Branding panel ───────────────────────────────── */}
      <div className="relative md:w-[52%] bg-[#13161E] text-white p-8 md:p-14 flex flex-col justify-between overflow-hidden min-h-[300px] border-r border-[#22283A]">

        {/* Grid pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Amber glow */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#F5A623]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-48 h-48 bg-[#60A5FA]/3 rounded-full blur-3xl pointer-events-none" />

        {/* Top branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div>
            <div className="text-[9px] font-mono font-medium text-[#F5A623] uppercase tracking-[0.2em]">{t('common.govOfRaj')}</div>
            <div className="font-bold text-sm text-white uppercase tracking-wide" style={{fontFamily:'Fraunces,Georgia,serif'}}>
              {t('certificates.printSub')}
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 my-10 space-y-6">

          {/* Gov badge */}
          <div className="gov-badge w-fit">
            <Lock className="w-2.5 h-2.5" /> {t('auth.stateDefenseRegistry')}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white"
            style={{fontFamily:'Fraunces,Georgia,serif'}}
          >
            {t('auth.cyberSecurityHub')}
          </h1>

          <p className="text-sm text-[#C2CCDF] leading-relaxed max-w-sm">{t('auth.authSubtitle')}</p>

          {/* Feature list */}
          <div className="space-y-3.5 pt-2">
            {[
              { icon: Award,       key: 'auth.certTitle'     },
              { icon: BookOpen,    key: 'auth.syllabusTitle' },
              { icon: ShieldAlert, key: 'auth.threatTitle'   },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3 text-sm text-[#C2CCDF]">
                <div className="w-7 h-7 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#F5A623]" />
                </div>
                {t(key)}
              </div>
            ))}
          </div>

          {/* Terminal widget */}
          <div className="mt-4 bg-[#0C0E14] border border-[#22283A] rounded-xl p-4 max-w-xs">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span className="text-[9px] font-mono text-[#8B9ABF] ml-1">AUTH TERMINAL</span>
            </div>
            <div className="font-mono text-[11px] space-y-1">
              <p className="text-[#22C55E]">$ status: <span className="text-[#F5A623]">SECURE</span></p>
              <p className="text-[#C2CCDF]">$ encryption: TLS 1.3</p>
              <p className="text-[#C2CCDF]">$ provider: Clerk Auth</p>
              <p className="text-[#8B9ABF] animate-pulse">▋</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-[9px] font-mono text-[#8B9ABF] uppercase tracking-widest">
          {t('auth.copyright')}
        </div>
      </div>

      {/* ─── Right: Auth card ───────────────────────────────────── */}
      <div className="md:w-[48%] flex flex-col items-center justify-center p-6 md:p-10 bg-[#0C0E14]">
        <div className="w-full max-w-[420px]">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B9ABF] hover:text-[#F5A623] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {t('auth.returnHome')}
          </Link>

          {/* Card header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg, #0C0E14, #1A1E2A)'}}>
                <Shield className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest leading-tight" style={{fontFamily:'Fraunces,Georgia,serif'}}>
                  {t('auth.lmsCredential')}
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-[2px] w-8 bg-[#F5A623] rounded-full" />
                  <div className="h-[2px] w-3 bg-[#F5A623]/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Clerk widget — isolated white card */}
          <div
            className="clerk-card-host"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.16)',
              padding: '32px 28px',
            }}
          >
            {isRegisterInitial ? (
              <SignUp routing="path" path="/register" signInUrl="/login" forceRedirectUrl="/dashboard" appearance={clerkAppearance} />
            ) : (
              <SignIn routing="path" path="/login" signUpUrl="/register" forceRedirectUrl="/dashboard" appearance={clerkAppearance} />
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-5 mt-5">
            {[
              { color: '#22C55E', label: '256-bit SSL' },
              { color: '#60A5FA', label: t('auth.secureEntry') },
              { color: '#F5A623', label: 'ISO 27001' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[10px] font-mono text-[#8B9ABF]">
                <div className="w-1.5 h-1.5 rounded-full" style={{background: color}} />
                {label}
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div className="text-[10px] font-mono text-[#8B9ABF] text-center flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-[#F5A623] transition-colors">{t('auth.privacyCharter')}</a>
            <span className="text-[#22283A]">·</span>
            <a href="#" className="hover:text-[#F5A623] transition-colors">{t('auth.systemDisclaimers')}</a>
            <span className="text-[#22283A]">·</span>
            <a href="#" className="hover:text-[#F5A623] transition-colors">{t('auth.supportRegistry')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
