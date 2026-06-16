import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Shield, Award, BookOpen, ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function AuthPages({ isRegisterInitial = false }) {
  const { theme } = useStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  // Light-mode only Clerk appearance — the card wrapper forces white BG via inline style
  // so global dark-mode CSS overrides won't bleed through the Clerk widget.
  const clerkAppearance = {
    variables: {
      colorPrimary: '#0A2540',
      colorText: '#1E293B',
      colorTextSecondary: '#64748B',
      colorBackground: '#FFFFFF',
      colorInputBackground: '#F8FAFC',
      colorInputText: '#1E293B',
      colorNeutral: '#64748B',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      borderRadius: '10px',
      fontSize: '14px',
    },
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 bg-transparent p-0 m-0 w-full',
      headerTitle: 'font-bold text-[#0A2540] text-[15px] tracking-tight',
      headerSubtitle: 'text-xs text-slate-500 font-medium mt-0.5',
      formButtonPrimary:
        'bg-[#0A2540] hover:bg-[#0d2f54] text-white text-xs font-bold uppercase tracking-widest py-3 transition-all cursor-pointer w-full rounded-xl shadow-md active:translate-y-[1px]',
      socialButtonsBlockButton:
        'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer bg-white w-full',
      socialButtonsBlockButtonText: 'text-gray-700 font-semibold text-sm',
      formFieldInput:
        'bg-[#F8FAFC] border border-gray-200 text-[#1E293B] focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/10 text-sm rounded-xl py-3 px-4 transition-all outline-none w-full',
      formFieldLabel: 'text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5',
      footerActionLink: 'text-[#0A2540] hover:text-[#D4AF37] font-bold transition-colors',
      footerActionText: 'text-xs text-gray-500',
      identityPreviewText: 'text-xs font-bold text-gray-700',
      identityPreviewEditButton: 'text-[#0A2540] hover:text-[#D4AF37] font-bold',
      formFieldInputShowPasswordButton: 'text-gray-400 hover:text-[#0A2540]',
      dividerText: 'text-gray-400 text-xs',
      dividerLine: 'bg-gray-200',
      otpCodeFieldInput: 'border border-gray-200 bg-[#F8FAFC] text-[#1E293B] rounded-xl',
      formResendCodeLink: 'text-[#0A2540] hover:text-[#D4AF37] font-bold',
      alertText: 'text-xs',
      formFieldErrorText: 'text-xs text-red-600',
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[#F1F5F9]">
      
      {/* ─── Left Column: Branding ─────────────────────────────── */}
      <div className="relative md:w-[52%] bg-gradient-to-br from-[#0A2540] via-[#0d2f54] to-[#051321] text-white p-8 md:p-14 flex flex-col justify-between overflow-hidden min-h-[280px]">
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        {/* Ambient glow */}
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 -left-10 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/10 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">{t('common.govOfRaj')}</div>
            <div className="font-bold text-xs tracking-wide text-white/90 uppercase">{t('certificates.printSub')}</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 rounded-full">
            <Lock className="w-3 h-3" /> {t('auth.stateDefenseRegistry')}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {t('auth.cyberSecurityHub')}
          </h1>
          <p className="text-sm text-white/55 leading-relaxed max-w-sm">
            {t('auth.authSubtitle')}
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              { icon: Award,       key: 'auth.certTitle'     },
              { icon: BookOpen,    key: 'auth.syllabusTitle' },
              { icon: ShieldAlert, key: 'auth.threatTitle'   },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3 text-sm text-white/80">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                {t(key)}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-[10px] text-white/30 uppercase tracking-widest">
          {t('auth.copyright')}
        </div>
      </div>

      {/* ─── Right Column: Auth Card ────────────────────────────── */}
      <div className="md:w-[48%] flex flex-col items-center justify-center p-6 md:p-10 bg-[#F1F5F9]">
        <div className="w-full max-w-[420px]">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#0A2540] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {t('auth.returnHome')}
          </Link>

          {/* Card header decoration */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0A2540, #1a4070)' }}
              >
                <Shield className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider leading-tight">
                  {t('auth.lmsCredential')}
                </h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="h-[2px] w-8 bg-[#D4AF37] rounded-full" />
                  <div className="h-[2px] w-3 bg-[#D4AF37]/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Clerk widget — inline style forces white BG to override any global dark-mode CSS */}
          <div
            className="clerk-card-host"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E8EDF2',
              boxShadow:
                '0 1px 3px rgba(10,37,64,0.04), 0 8px 24px rgba(10,37,64,0.08), 0 32px 56px rgba(10,37,64,0.06)',
              padding: '32px 28px',
            }}
          >
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

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              256-bit SSL
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {t('auth.secureEntry')}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              ISO 27001
            </div>
          </div>

          {/* Footer links */}
          <div className="text-[10px] text-gray-400 text-center flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-gray-600 transition-colors">{t('auth.privacyCharter')}</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="hover:text-gray-600 transition-colors">{t('auth.systemDisclaimers')}</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="hover:text-gray-600 transition-colors">{t('auth.supportRegistry')}</a>
          </div>
        </div>
      </div>

    </div>
  );
}
