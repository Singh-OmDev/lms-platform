import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Shield, Award, BookOpen, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../utils/translations';

export default function AuthPages({ isRegisterInitial = false }) {
  const { t, language, setLanguage } = useTranslation();

  const clerkAppearance = {
    variables: {
      colorPrimary: '#1a3c8f',
      colorText: '#1a1a2e',
      colorTextSecondary: '#5a6a8a',
      colorBackground: '#ffffff',
      colorInputBackground: '#f4f6fb',
      colorInputText: '#1a1a2e',
      colorNeutral: '#5a6a8a',
      fontFamily: "'Noto Sans', system-ui, sans-serif",
      borderRadius: '8px',
      fontSize: '14px',
    },
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 bg-transparent p-0 m-0 w-full',
      headerTitle: 'font-bold text-[#1a1a2e] text-[16px]',
      headerSubtitle: 'text-xs text-[#5a6a8a] font-medium mt-0.5',
      formButtonPrimary:
        'bg-[#f4821e] hover:bg-[#d96a0a] text-white text-sm font-bold py-3 transition-all cursor-pointer w-full rounded-lg',
      socialButtonsBlockButton:
        'border border-[#dde3f0] hover:border-[#1a3c8f] hover:bg-[#f0f4ff] text-[#1a1a2e] text-sm font-semibold py-2.5 rounded-lg transition-all cursor-pointer bg-white w-full',
      socialButtonsBlockButtonText: 'text-[#1a1a2e] font-semibold text-sm',
      formFieldInput:
        'bg-[#f4f6fb] border border-[#dde3f0] text-[#1a1a2e] focus:border-[#1a3c8f] focus:ring-2 focus:ring-[#1a3c8f]/10 text-sm rounded-lg py-3 px-4 transition-all outline-none w-full',
      formFieldLabel: 'text-[11px] font-bold uppercase tracking-wider text-[#5a6a8a] mb-1.5',
      footerActionLink: 'text-[#1a3c8f] hover:text-[#f4821e] font-bold transition-colors',
      footerActionText: 'text-xs text-[#5a6a8a]',
      identityPreviewText: 'text-xs font-bold text-[#1a1a2e]',
      identityPreviewEditButton: 'text-[#1a3c8f] hover:text-[#f4821e] font-bold',
      formFieldInputShowPasswordButton: 'text-[#5a6a8a] hover:text-[#1a3c8f]',
      dividerText: 'text-[#5a6a8a] text-xs',
      dividerLine: 'bg-[#dde3f0]',
      otpCodeFieldInput: 'border border-[#dde3f0] bg-[#f4f6fb] text-[#1a1a2e] rounded-lg',
      formResendCodeLink: 'text-[#1a3c8f] hover:text-[#f4821e] font-bold',
      alertText: 'text-xs',
      formFieldErrorText: 'text-xs text-red-600',
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[#f4f6fb]">

      {/* ─── Left: Government Branding Panel ──────────────────────── */}
      <div className="relative md:w-[52%] bg-gradient-to-br from-[#0d244f] to-[#1a3c8f] text-white p-8 md:p-14 flex flex-col justify-between overflow-hidden min-h-[300px]">

        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -left-8 -bottom-20 w-72 h-72 bg-[#f4821e]/10 rounded-full" />

        {/* Top branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">सु</span>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">{t('common.govOfRaj')}</div>
              <div className="font-bold text-[15px] text-white">Suraksha.AI Platform</div>
            </div>
          </div>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white/80 hover:bg-white/20 transition-all mb-8"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'en' ? 'हिन्दी में देखें' : 'View in English'}
          </button>

          <h1 className="text-[28px] md:text-[36px] font-bold leading-[1.2] mb-4">
            {t('auth.cyberSecurityHub')}
          </h1>
          <p className="text-[14px] text-white/70 leading-relaxed max-w-sm">
            {t('auth.authSubtitle')}
          </p>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-4 mt-8">
          {[
            { icon: Award,    title: t('auth.certTitle'),    desc: t('auth.certDesc') },
            { icon: BookOpen, title: t('auth.syllabusTitle'), desc: t('auth.syllabusDesc') },
            { icon: Shield,   title: t('auth.threatTitle'),  desc: t('auth.threatDesc') },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-[#f4821e]/20 border border-[#f4821e]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-[#f4821e]" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">{title}</p>
                <p className="text-[12px] text-white/60 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Indian flag accent */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-white/50">
            <svg className="w-5 h-3 flex-shrink-0 rounded-sm" viewBox="0 0 30 20">
              <rect width="30" height="20" fill="#138808"/>
              <rect width="30" height="13.333" fill="#ffffff"/>
              <rect width="30" height="6.667" fill="#FF9933"/>
              <circle cx="15" cy="10" r="2" fill="none" stroke="#000080" strokeWidth="0.3"/>
              <circle cx="15" cy="10" r="0.4" fill="#000080"/>
              <line x1="15" y1="8" x2="15" y2="12" stroke="#000080" strokeWidth="0.15"/>
              <line x1="13" y1="10" x2="17" y2="10" stroke="#000080" strokeWidth="0.15"/>
              <line x1="13.6" y1="8.6" x2="16.4" y2="11.4" stroke="#000080" strokeWidth="0.15"/>
              <line x1="13.6" y1="11.4" x2="16.4" y2="8.6" stroke="#000080" strokeWidth="0.15"/>
            </svg>
            {t('auth.copyright')} {t('auth.officialConsole')}
          </div>
          <Link to="/" className="text-[11px] text-white/50 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" /> {t('auth.returnHome')}
          </Link>
        </div>
      </div>

      {/* ─── Right: Clerk form panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-14 bg-white min-h-screen">

        {/* Accessibility bar */}
        <div className="w-full max-w-sm mb-6">
          <div className="flex items-center justify-between text-[11px] text-[#5a6a8a] pb-4 border-b border-[#dde3f0]">
            <span className="font-semibold text-[#1a3c8f]">DoIT&C Secure Login</span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 hover:text-[#1a3c8f] transition-colors"
            >
              <Globe className="w-3 h-3" />
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {isRegisterInitial
            ? <SignUp appearance={clerkAppearance} />
            : <SignIn appearance={clerkAppearance} />
          }
        </div>

        {/* Footer */}
        <p className="mt-8 text-[11px] text-[#9aaed0] text-center max-w-xs">
          {t('auth.copyright')} {t('common.privacyPolicy')} · {t('common.termsOfUse')}
        </p>
      </div>
    </div>
  );
}
