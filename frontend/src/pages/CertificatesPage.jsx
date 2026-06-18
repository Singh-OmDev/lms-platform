import React, { useEffect, useState } from 'react';
import { Award, Eye, X, Printer, HelpCircle, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function CertificatesPage() {
  const { user, addToast } = useStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [viewCertificate, setViewCertificate] = useState(null);

  // Test states
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submittingTest, setSubmittingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

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

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenTest = async (category) => {
    try {
      setActiveCategory(category);
      setLoadingTest(true);
      setTestModalOpen(true);
      setAnswers({});
      setTestResult(null);
      
      const res = await api.get(`/tests/${encodeURIComponent(category)}`);
      if (res.data.test) {
        setActiveTest(res.data.test);
        
        // If there is an existing submission, populate answers
        if (res.data.submission && res.data.submission.answers) {
          try {
            setAnswers(JSON.parse(res.data.submission.answers));
          } catch (e) {
            console.error('Failed to parse answers', e);
          }
        }
      } else {
        setActiveTest(null);
        addToast('No test has been configured for this module yet.', 'warning');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load module test questions', 'danger');
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    if (!activeTest) return;

    // Validation: make sure all questions are answered
    const unanswered = activeTest.questions.filter(q => answers[q.id] === undefined || answers[q.id] === '');
    if (unanswered.length > 0) {
      addToast(`Please answer all questions. (${unanswered.length} remaining)`, 'warning');
      return;
    }

    try {
      setSubmittingTest(true);
      const res = await api.post(`/tests/${encodeURIComponent(activeCategory)}/submit`, {
        answers
      });
      addToast(
        res.data.hasShortAnswer 
          ? 'Assessment submitted successfully! Pending grading by admin.' 
          : 'Assessment submitted! Auto-graded successfully.', 
        'success'
      );
      setTestResult(res.data);
      fetchStats(); // Refresh certificate states
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Failed to submit assessment';
      addToast(errorMsg, 'danger');
    } finally {
      setSubmittingTest(false);
    }
  };

  const renderTestButton = (category, testStatus, catStats) => {
    switch (testStatus) {
      case 'no_test':
        return (
          <button 
            disabled
            className="py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 rounded-md select-none"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Assessment Pending
          </button>
        );
      case 'not_taken':
        return (
          <button 
            onClick={() => handleOpenTest(category)}
            className="btn-gold py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer text-[#0A2540]"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Take Assessment
          </button>
        );
      case 'pending':
        return (
          <button 
            disabled
            className="py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 rounded-md select-none"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pending Review
          </button>
        );
      case 'failed':
        return (
          <button 
            onClick={() => handleOpenTest(category)}
            className="py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" /> Retry Assessment
          </button>
        );
      case 'passed':
        return (
          <button 
            onClick={() => setViewCertificate(category === 'Artificial Intelligence' ? 'ai' : 'cyber')}
            className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> {t('certificates.downloadPdf')}
          </button>
        );
      default:
        return null;
    }
  };

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

  const aiStats = stats?.categoryStats?.['Artificial Intelligence'] || { total: 0, completed: 0, testStatus: 'no_test' };
  const cyberStats = stats?.categoryStats?.['Cybersecurity'] || { total: 0, completed: 0, testStatus: 'no_test' };

  const hasAI = aiStats.total > 0 && aiStats.completed === aiStats.total && aiStats.testStatus === 'passed';
  const hasCyber = cyberStats.total > 0 && cyberStats.completed === cyberStats.total && cyberStats.testStatus === 'passed';

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
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-sm text-[#0A2540]">{t('certificates.aiTitle')}</h3>
              <p className="text-neutral-500 text-xs mt-1 leading-normal">
                {t('certificates.aiDesc')}
              </p>
              
              {aiStats.testStatus === 'failed' && aiStats.submissionFeedback && (
                <div className="mt-2.5 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200/60 leading-relaxed flex items-start gap-1.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Review Feedback:</strong> "{aiStats.submissionFeedback}"
                  </div>
                </div>
              )}
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
            ) : aiStats.total > 0 && aiStats.completed === aiStats.total ? (
              renderTestButton('Artificial Intelligence', aiStats.testStatus, aiStats)
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
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-sm text-[#0A2540]">{t('certificates.cyberTitle')}</h3>
              <p className="text-neutral-500 text-xs mt-1 leading-normal">
                {t('certificates.cyberDesc')}
              </p>

              {cyberStats.testStatus === 'failed' && cyberStats.submissionFeedback && (
                <div className="mt-2.5 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200/60 leading-relaxed flex items-start gap-1.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Review Feedback:</strong> "{cyberStats.submissionFeedback}"
                  </div>
                </div>
              )}
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
            ) : cyberStats.total > 0 && cyberStats.completed === cyberStats.total ? (
              renderTestButton('Cybersecurity', cyberStats.testStatus, cyberStats)
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

      {/* Assessment taking modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#cbd5e0] p-8 rounded-sm shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button 
              onClick={() => {
                setTestModalOpen(false);
                setTestResult(null);
              }}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-serif font-bold text-[#0A2540]">{activeCategory} Assessment</h2>
              <p className="text-neutral-550 text-xs mt-1">
                Complete the questions below to demonstrate module comprehension and claim your certificate.
              </p>
            </div>

            {loadingTest ? (
              <div className="space-y-4 py-8 text-center text-xs text-neutral-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0A2540]" />
                <p>Loading assessment questions...</p>
              </div>
            ) : !activeTest ? (
              <div className="py-8 text-center text-xs text-neutral-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p>No assessment configured yet for this module.</p>
              </div>
            ) : testResult ? (
              <div className="space-y-6 py-4 text-center animate-in fade-in zoom-in duration-200">
                {testResult.hasShortAnswer ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-200">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif font-bold text-[#0A2540]">Assessment Submitted</h3>
                      <p className="text-xs text-neutral-550 max-w-md mx-auto leading-relaxed">
                        Your answers have been submitted. Since this assessment includes short-answer questions, a course administrator will grade it manually. Your dashboard status will update once grading is complete.
                      </p>
                    </div>
                    <div className="pt-4 max-w-sm mx-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setTestModalOpen(false);
                          setTestResult(null);
                        }}
                        className="btn-primary w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {testResult.submission.passed ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-200 animate-bounce">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-serif font-bold text-emerald-600">Assessment Passed!</h3>
                          <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-mono text-sm font-bold">
                            Score: {testResult.submission.score}%
                          </div>
                          <p className="text-xs text-neutral-555 max-w-md mx-auto leading-relaxed">
                            Excellent work! You answered all questions correctly and have officially earned your certificate of completion for the {activeCategory} track.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-md mx-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setTestModalOpen(false);
                              setViewCertificate(activeCategory === 'Artificial Intelligence' ? 'ai' : 'cyber');
                              setTestResult(null);
                            }}
                            className="btn-gold py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A2540] cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-[#0A2540]" /> View Certificate
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTestModalOpen(false);
                              setTestResult(null);
                            }}
                            className="btn-primary py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-200 animate-pulse">
                          <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-serif font-bold text-red-600">Assessment Not Passed</h3>
                          <div className="inline-block px-3 py-1 bg-red-50 text-red-700 border border-red-200/60 rounded-full font-mono text-sm font-bold">
                            Score: {testResult.submission.score}%
                          </div>
                          <p className="text-xs text-neutral-555 max-w-md mx-auto leading-relaxed">
                            You scored {testResult.submission.score}%. A score of 100% is required to pass the assessment and receive the certificate.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-md mx-auto">
                          <button
                            type="button"
                            onClick={() => setTestResult(null)}
                            className="btn-gold py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A2540] cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4 text-[#0A2540]" /> Retake Assessment
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTestModalOpen(false);
                              setTestResult(null);
                            }}
                            className="btn-primary py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitTest} className="space-y-6">
                
                {/* Info Banner */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Passing Criteria:</strong> You must score at least 70% on MCQ questions. Any short-answer responses will be manually graded by the Course Administrator.
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {activeTest.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-[#0A2540] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-[#0A2540] leading-normal">{q.questionText}</p>
                      </div>

                      {q.type === 'MCQ' ? (
                        <div className="grid grid-cols-1 gap-2 pl-7 pt-1">
                          {q.options.split('|').map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-all ${
                                String(answers[q.id]) === String(optIdx)
                                  ? 'bg-[#0A2540]/5 border-[#0A2540] text-[#0A2540] font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`question-${q.id}`} 
                                checked={String(answers[q.id]) === String(optIdx)}
                                onChange={() => setAnswers({ ...answers, [q.id]: String(optIdx) })}
                                className="accent-[#0A2540] w-3.5 h-3.5"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="pl-7 pt-1">
                          <textarea
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            rows={3}
                            placeholder="Write your answer clearly and concisely..."
                            className="w-full p-3 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none focus:border-[#0A2540]"
                            required
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submittingTest}
                  className="btn-gold w-full py-2.5 flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs font-bold text-[#0A2540] cursor-pointer disabled:opacity-60"
                >
                  {submittingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0A2540]" /> Submitting Assessment...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-[#0A2540]" /> Submit Assessment
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
