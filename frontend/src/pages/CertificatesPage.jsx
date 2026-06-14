import React, { useEffect, useState } from 'react';
import { Award, Eye, X, Printer } from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function CertificatesPage() {
  const { user, addToast } = useStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [viewCertificate, setViewCertificate] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
        addToast('Failed to load certificates metrics', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-6 bg-neutral-300 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-neutral-300 rounded border border-[#cbd5e0]" />
          <div className="h-40 bg-neutral-300 rounded border border-[#cbd5e0]" />
        </div>
      </div>
    );
  }

  const aiStats = stats?.categoryStats?.['Artificial Intelligence'] || { total: 0, completed: 0 };
  const cyberStats = stats?.categoryStats?.['Cybersecurity'] || { total: 0, completed: 0 };

  const hasAI = aiStats.total > 0 && aiStats.completed === aiStats.total;
  const hasCyber = cyberStats.total > 0 && cyberStats.completed === cyberStats.total;

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      
      {/* Header */}
      <div className="border-b-2 border-[#d2d6dc] pb-4">
        <h1 className="text-xl font-serif font-bold text-[#0A2540] tracking-tight">{t('certificates.title')}</h1>
        <p className="text-neutral-500 text-xs mt-1">
          {t('certificates.subtitle')}
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Certificate */}
        <div className="rounded-sm border border-[#cbd5e0] bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded bg-[#f8fafc] border ${hasAI ? 'border-amber-400 text-amber-500' : 'border-neutral-200 text-neutral-400'}`}>
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#0A2540]">{t('certificates.aiTitle')}</h3>
              <p className="text-neutral-500 text-xs mt-1 leading-normal">
                {t('certificates.aiDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#edf2f7]">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${hasAI ? 'text-emerald-600' : 'text-neutral-450'}`}>
              {hasAI ? t('certificates.earned') : t('certificates.locked')}
            </span>
            {hasAI ? (
              <button 
                onClick={() => setViewCertificate('ai')}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> {t('certificates.downloadPdf')}
              </button>
            ) : (
              <span className="text-[10px] font-mono font-bold text-neutral-550 bg-[#edf2f7] px-2 py-1 border border-[#cbd5e0] rounded-sm select-none">
                {aiStats.completed} / {aiStats.total} {t('catalog.completedBadge')}
              </span>
            )}
          </div>
        </div>

        {/* Cyber Certificate */}
        <div className="rounded-sm border border-[#cbd5e0] bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded bg-[#f8fafc] border ${hasCyber ? 'border-amber-400 text-amber-500' : 'border-neutral-200 text-neutral-400'}`}>
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#0A2540]">{t('certificates.cyberTitle')}</h3>
              <p className="text-neutral-500 text-xs mt-1 leading-normal">
                {t('certificates.cyberDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#edf2f7]">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${hasCyber ? 'text-emerald-600' : 'text-neutral-450'}`}>
              {hasCyber ? t('certificates.earned') : t('certificates.locked')}
            </span>
            {hasCyber ? (
              <button 
                onClick={() => setViewCertificate('cyber')}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> {t('certificates.downloadPdf')}
              </button>
            ) : (
              <span className="text-[10px] font-mono font-bold text-neutral-555 bg-[#edf2f7] px-2 py-1 border border-[#cbd5e0] rounded-sm select-none">
                {cyberStats.completed} / {cyberStats.total} {t('catalog.completedBadge')}
              </span>
            )}
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
              className="absolute top-4 right-4 text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate content - formal navy gold print document */}
            <div className="certificate-print-container border-4 border-[#0A2540] bg-white p-8 space-y-6 text-center rounded-sm relative">
              {/* Decorative Gold corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]"></div>

              <div className="flex justify-center mb-2">
                <img src="/rajasthan_logo.png" alt="Government of Rajasthan Logo" className="w-16 h-16 object-contain" />
              </div>

              <h2 className="text-lg font-serif font-bold tracking-widest text-[#0A2540] uppercase">{t('certificates.printTitle')}</h2>
              <p className="text-[9px] font-sans text-neutral-500 uppercase tracking-widest font-bold">{t('certificates.printSub')}</p>
              
              <div className="h-0.5 bg-[#D4AF37] w-20 mx-auto my-2" />
              
              <p className="text-[10px] font-sans text-[#718096] uppercase tracking-wider">{t('certificates.printOfficial')}</p>
              
              <h1 className="text-2xl font-serif font-bold text-[#0A2540] underline underline-offset-4 decoration-[#D4AF37] decoration-2">{user?.name}</h1>
              
              <p className="text-xs text-[#4a5568] max-w-sm mx-auto leading-relaxed">
                {t('certificates.printDesc')}
              </p>
              
              <div className="p-2.5 rounded-sm bg-[#f0f4f8] border border-[#cbd5e0] inline-block">
                <span className="text-xs font-serif font-bold text-[#0A2540] uppercase">
                  {viewCertificate === 'ai' 
                    ? (t('certificates.title') === 'Compliance Credentials Center' ? 'Artificial Intelligence Core & Neural Systems' : 'आर्टिफिशियल इंटेलिजेंस कोर और न्यूरल सिस्टम')
                    : (t('certificates.title') === 'Compliance Credentials Center' ? 'Cybersecurity Defense Penetration Frameworks' : 'साइबर सुरक्षा रक्षा प्रवेश ढांचा')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 max-w-sm mx-auto text-[9px] font-mono text-neutral-550 font-bold uppercase tracking-wider">
                <div className="border-t border-[#cbd5e0] pt-2">
                  {t('certificates.director')}
                </div>
                <div className="border-t border-[#cbd5e0] pt-2">
                  {t('certificates.coordinator')}
                </div>
              </div>
            </div>

            {/* Print button */}
            <button 
              onClick={() => window.print()}
              className="btn-gold w-full py-2.5 flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs font-bold text-[#0A2540] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#0A2540]" /> {t('certificates.printCredential')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
