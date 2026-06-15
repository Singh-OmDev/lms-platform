import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  Video, 
  Clock, 
  Activity,
  Award,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Edit,
  ClipboardList
} from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function AdminDashboard() {
  const { addToast } = useStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'manage_tests', 'grade_submissions'

  // Manage Module Tests State
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Artificial Intelligence');
  const [editingQuestions, setEditingQuestions] = useState([]);

  // Grade Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'graded'
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradePassed, setGradePassed] = useState(false);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  // Fetch initial analytics and submissions list
  const fetchAdminStatsAndSubmissions = async () => {
    try {
      setLoading(true);
      const [statsRes, subRes] = await Promise.all([
        api.get('/analytics/admin-stats'),
        api.get('/tests/admin/submissions').catch(() => ({ data: [] }))
      ]);
      setStatsData(statsRes.data);
      setSubmissions(subRes.data);
    } catch (err) {
      console.error(err);
      addToast('Access denied or failed to retrieve admin metrics', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStatsAndSubmissions();
  }, []);

  // Fetch tests for configuring
  const fetchTests = async () => {
    try {
      setLoadingTests(true);
      const res = await api.get('/tests/admin/config');
      setTests(res.data);
      
      const currentTest = res.data.find(t => t.category === selectedCategory);
      if (currentTest) {
        setEditingQuestions(currentTest.questions || []);
      } else {
        setEditingQuestions([]);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load test configurations', 'danger');
    } finally {
      setLoadingTests(false);
    }
  };

  // Fetch submissions list (refresh)
  const fetchSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const res = await api.get('/tests/admin/submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load student submissions', 'danger');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Fetch data depending on active tab
  useEffect(() => {
    if (activeTab === 'manage_tests') {
      fetchTests();
    } else if (activeTab === 'grade_submissions') {
      fetchSubmissions();
    }
  }, [activeTab]);

  // Update questions array when category changes
  useEffect(() => {
    const currentTest = tests.find(t => t.category === selectedCategory);
    if (currentTest) {
      setEditingQuestions(currentTest.questions || []);
    } else {
      setEditingQuestions([]);
    }
  }, [selectedCategory, tests]);

  // Question editing handlers
  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: Date.now() * -1, // temp ID
      type,
      questionText: '',
      options: type === 'MCQ' ? 'Option 1|Option 2' : '',
      correctOption: type === 'MCQ' ? '0' : ''
    };
    setEditingQuestions([...editingQuestions, newQuestion]);
  };

  const handleDeleteQuestion = (id) => {
    setEditingQuestions(editingQuestions.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id, field, value) => {
    setEditingQuestions(editingQuestions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleUpdateOption = (qId, optIdx, newValue) => {
    setEditingQuestions(editingQuestions.map(q => {
      if (q.id === qId) {
        const optsArray = q.options.split('|');
        optsArray[optIdx] = newValue.replace(/\|/g, ''); // prevent pipe character collision
        return { ...q, options: optsArray.join('|') };
      }
      return q;
    }));
  };

  const handleAddOptionField = (qId) => {
    setEditingQuestions(editingQuestions.map(q => {
      if (q.id === qId) {
        const optsArray = q.options ? q.options.split('|') : [];
        if (optsArray.length >= 6) {
          addToast('Maximum 6 options allowed', 'warning');
          return q;
        }
        optsArray.push(`Option ${optsArray.length + 1}`);
        return { ...q, options: optsArray.join('|') };
      }
      return q;
    }));
  };

  const handleRemoveOptionField = (qId, optIdx) => {
    setEditingQuestions(editingQuestions.map(q => {
      if (q.id === qId) {
        const optsArray = q.options.split('|');
        if (optsArray.length <= 2) {
          addToast('An MCQ must have at least 2 options', 'warning');
          return q;
        }
        optsArray.splice(optIdx, 1);
        
        let newCorrect = q.correctOption;
        const correctIndex = parseInt(q.correctOption);
        if (correctIndex === optIdx) {
          newCorrect = '0';
        } else if (correctIndex > optIdx) {
          newCorrect = String(correctIndex - 1);
        }
        
        return { ...q, options: optsArray.join('|'), correctOption: newCorrect };
      }
      return q;
    }));
  };

  const handleSaveTest = async () => {
    if (editingQuestions.length === 0) {
      addToast('Please add at least one question before saving', 'warning');
      return;
    }
    
    for (let i = 0; i < editingQuestions.length; i++) {
      const q = editingQuestions[i];
      if (!q.questionText.trim()) {
        addToast(`Question ${i + 1} statement cannot be empty`, 'warning');
        return;
      }
      if (q.type === 'MCQ') {
        const opts = q.options.split('|');
        if (opts.length < 2) {
          addToast(`Question ${i + 1} (MCQ) must have at least 2 options`, 'warning');
          return;
        }
        if (opts.some(o => !o.trim())) {
          addToast(`Options for Question ${i + 1} cannot be blank`, 'warning');
          return;
        }
        const correctIdx = parseInt(q.correctOption);
        if (isNaN(correctIdx) || correctIdx < 0 || correctIdx >= opts.length) {
          addToast(`Please select a valid correct option for Question ${i + 1}`, 'warning');
          return;
        }
      } else if (q.type === 'SHORT') {
        if (!q.correctOption.trim()) {
          addToast(`Question ${i + 1} (Short Answer) requires a model answer reference`, 'warning');
          return;
        }
      }
    }

    try {
      setLoadingTests(true);
      const cleanedQuestions = editingQuestions.map(({ id, ...q }) => ({
        ...q,
        options: q.options || '',
        correctOption: String(q.correctOption)
      }));

      const res = await api.post('/tests/admin/config', {
        category: selectedCategory,
        questions: cleanedQuestions
      });

      addToast(`Test configuration for "${selectedCategory}" saved successfully!`, 'success');
      
      const updatedTests = tests.map(t => t.category === selectedCategory ? res.data : t);
      if (!tests.some(t => t.category === selectedCategory)) {
        updatedTests.push(res.data);
      }
      setTests(updatedTests);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save test configuration', 'danger');
    } finally {
      setLoadingTests(false);
    }
  };

  // Submissions grading handlers
  const handleOpenGradingModal = (sub) => {
    setGradingSubmission(sub);
    setGradeScore(sub.score !== null ? String(sub.score) : '');
    setGradePassed(sub.passed || false);
    setGradeFeedback(sub.feedback || '');
  };

  const handleScoreChange = (val) => {
    setGradeScore(val);
    const num = parseInt(val);
    if (!isNaN(num)) {
      // Auto-set pass checkbox based on 70% threshold
      setGradePassed(num >= 70);
    }
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const scoreNum = parseInt(gradeScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      addToast('Please enter a valid score between 0 and 100', 'warning');
      return;
    }

    try {
      setSubmittingGrade(true);
      await api.post(`/tests/admin/submissions/${gradingSubmission.id}/grade`, {
        score: scoreNum,
        passed: gradePassed,
        feedback: gradeFeedback
      });

      addToast('Student submission graded successfully!', 'success');
      
      setSubmissions(submissions.map(sub => sub.id === gradingSubmission.id ? {
        ...sub,
        score: scoreNum,
        passed: gradePassed,
        feedback: gradeFeedback,
        status: 'graded',
        gradedAt: new Date().toISOString()
      } : sub));
      
      setGradingSubmission(null);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to grade submission', 'danger');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const getMCQScoreText = (sub) => {
    if (!sub.test || !sub.test.questions) return 'N/A';
    const mcqs = sub.test.questions.filter(q => q.type === 'MCQ');
    if (mcqs.length === 0) return 'No MCQs';
    
    let studentAnswers = {};
    try {
      studentAnswers = JSON.parse(sub.answers || '{}');
    } catch(e) {}
    
    let correctCount = 0;
    mcqs.forEach(q => {
      const ans = studentAnswers[q.id];
      if (ans !== undefined && String(ans).trim() === String(q.correctOption).trim()) {
        correctCount++;
      }
    });
    
    return `${correctCount} / ${mcqs.length}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-neutral-300 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-neutral-300 rounded border border-[#d2d6dc]" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, charts } = statsData || {};
  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      {/* Dossier Header */}
      <div className="border-b-2 border-[#d2d6dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0A2540] tracking-tight">{t('admin.title')}</h1>
          <p className="text-neutral-500 text-xs mt-1">
            {t('admin.subtitle')}
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#cbd5e0] sm:border-b-0 space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-[#0A2540] text-[#0A2540]'
                : 'border-transparent text-neutral-500 hover:text-[#0A2540]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> {t('admin.overview', 'Overview')}
          </button>
          <button
            onClick={() => setActiveTab('manage_tests')}
            className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manage_tests'
                ? 'border-[#0A2540] text-[#0A2540]'
                : 'border-transparent text-neutral-500 hover:text-[#0A2540]'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> {t('admin.manageTests', 'Manage Module Tests')}
          </button>
          <button
            onClick={() => setActiveTab('grade_submissions')}
            className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grade_submissions'
                ? 'border-[#0A2540] text-[#0A2540]'
                : 'border-transparent text-neutral-500 hover:text-[#0A2540]'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> {t('admin.gradeSubmissions', 'Grade Submissions')}
            {submissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                {submissions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="border-l-4 border-l-[#0A2540] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('admin.totalUsers')}</span>
                <h3 className="text-2xl font-serif font-bold text-[#0A2540]">{stats?.totalUsers || 0}</h3>
              </div>
              <Users className="w-5 h-5 text-[#0A2540]" />
            </div>

            {/* Total Courses */}
            <div className="border-l-4 border-l-[#0A2540] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('admin.videosCatalog')}</span>
                <h3 className="text-2xl font-serif font-bold text-[#0A2540]">{stats?.totalVideos || 0}</h3>
              </div>
              <Video className="w-5 h-5 text-[#0A2540]" />
            </div>

            {/* Active Users */}
            <div className="border-l-4 border-l-[#0A2540] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('admin.activeWatchers')}</span>
                <h3 className="text-2xl font-serif font-bold text-[#0A2540]">{stats?.activeUsers || 0}</h3>
              </div>
              <Activity className="w-5 h-5 text-[#0A2540]" />
            </div>

            {/* Watch Hours */}
            <div className="border-l-4 border-l-[#0A2540] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">{t('admin.watchDuration')}</span>
                <h3 className="text-2xl font-serif font-bold text-[#0A2540]">{stats?.watchHours || 0} {t('admin.hours')}</h3>
              </div>
              <Clock className="w-5 h-5 text-[#0A2540]" />
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white flex flex-col h-80 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
                <h3 className="font-serif font-bold text-xs text-[#0A2540] uppercase tracking-wider">{t('admin.registrations')}</h3>
                <span className="text-[10px] font-semibold text-neutral-500 font-mono">{t('admin.monthlyRegistry')}</span>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.userGrowth} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#4a5568" fontSize={10} tickLine={false} />
                    <YAxis stroke="#4a5568" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e0', borderRadius: '2px' }}
                      itemStyle={{ fontSize: '11px', color: '#1a202c' }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#002C6C" strokeWidth={2} dot={{ r: 4, fill: '#002C6C', stroke: '#FFFFFF', strokeWidth: 1 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category popularity */}
            <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white flex flex-col h-80 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
                <h3 className="font-serif font-bold text-xs text-[#0A2540] uppercase tracking-wider">{t('admin.engagement')}</h3>
                <span className="text-[10px] font-semibold text-neutral-500 font-mono">{t('admin.viewsDomain')}</span>
              </div>
              <div className="flex-grow w-full">
                {charts?.categoryPopularity?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.categoryPopularity} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#4a5568" fontSize={10} tickLine={false} />
                      <YAxis stroke="#4a5568" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e0', borderRadius: '2px' }}
                        itemStyle={{ fontSize: '11px', color: '#1a202c' }}
                      />
                      <Bar dataKey="value" fill="#002C6C" radius={[2, 2, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-neutral-500 text-xs py-20 text-center">{t('admin.noRecords')}</div>
                )}
              </div>
            </div>
          </div>

          {/* Popular Lessons Table */}
          <div className="p-5 bg-white border border-[#cbd5e0] rounded-sm shadow-sm">
            <h3 className="font-serif font-bold text-xs text-[#0A2540] uppercase tracking-wider mb-4 pb-2 border-b border-[#cbd5e0]">{t('admin.popularModules')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#cbd5e0] bg-[#f8fafc] text-neutral-600 font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">{t('admin.table.title')}</th>
                    <th className="py-3 px-3">{t('admin.table.category')}</th>
                    <th className="py-3 px-3">{t('admin.table.viewsCount')}</th>
                    <th className="py-3 px-3">{t('admin.table.completionRate')}</th>
                    <th className="py-3 px-3">{t('admin.table.uploadDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {charts?.mostViewedVideos?.length > 0 ? (
                    charts.mostViewedVideos.map((video) => (
                      <tr key={video.id} className="border-b border-[#cbd5e0] hover:bg-neutral-50 text-[#2d3748]">
                        <td className="py-3 px-3 font-serif font-bold text-[#0A2540] max-w-xs truncate">{video.title}</td>
                        <td className="py-3 px-3 font-semibold text-neutral-500">{video.category}</td>
                        <td className="py-3 px-3 font-mono">{video.views} {t('admin.table.enrollees')}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold w-8">{video.completionRate}%</span>
                            <div className="w-16 bg-[#e2e8f0] h-2 rounded-sm overflow-hidden border border-[#cbd5e0]">
                              <div className="bg-[#0A2540] h-full" style={{ width: `${video.completionRate}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-neutral-500 font-mono">{video.uploadDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-neutral-500 font-mono">{t('admin.table.noTelemetry')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'manage_tests' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 bg-white border border-[#cbd5e0] rounded-sm shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-serif font-bold text-[#0A2540]">Assessment Configuration Panel</h2>
                <p className="text-neutral-550 text-xs mt-1">
                  Design assessments (MCQs and Short Answer) that students must pass to claim course completion credentials.
                </p>
              </div>
              
              {/* Category Selector Dropdown */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">Module:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-[#cbd5e0] text-[#0A2540] text-xs font-semibold py-1.5 px-3 rounded-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>
            </div>
          </div>

          {loadingTests ? (
            <div className="p-12 text-center bg-white border border-[#cbd5e0] rounded-sm shadow-sm">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0A2540] mb-2" />
              <p className="text-xs text-neutral-500">Loading category tests configuration...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Action Buttons to Add Questions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddQuestion('MCQ')}
                  className="py-2 px-4 bg-[#0A2540] text-white hover:bg-[#001f4d] border border-[#0A2540] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add MCQ Question
                </button>
                <button
                  onClick={() => handleAddQuestion('SHORT')}
                  className="py-2 px-4 bg-white text-[#0A2540] hover:bg-slate-50 border border-[#cbd5e0] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Short Answer Question
                </button>
              </div>

              {/* Questions List */}
              {editingQuestions.length === 0 ? (
                <div className="p-16 text-center bg-slate-50 border border-[#cbd5e0] rounded-sm border-dashed">
                  <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                  <h3 className="text-xs font-bold text-slate-700">No Assessment Configured</h3>
                  <p className="text-[11px] text-neutral-500 mt-1 max-w-sm mx-auto">
                    Add MCQ and short answer questions using the buttons above to establish a testing track for this category.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {editingQuestions.map((q, idx) => (
                    <div key={q.id} className="p-5 bg-white border border-[#cbd5e0] rounded-sm shadow-sm space-y-4 relative">
                      {/* Trash Button */}
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="absolute top-5 right-5 text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded-sm transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Header label */}
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0A2540] text-white text-[10px] font-mono px-2 py-0.5 rounded-sm">
                          Question {idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 border rounded-sm ${
                          q.type === 'MCQ' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {q.type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Question Statement</label>
                        <input
                          type="text"
                          value={q.questionText}
                          onChange={(e) => handleUpdateQuestion(q.id, 'questionText', e.target.value)}
                          placeholder="Type the question statement clearly..."
                          className="w-full p-2.5 border border-[#cbd5e0] rounded-sm text-xs text-slate-800 outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Options and answers */}
                      {q.type === 'MCQ' ? (
                        <div className="space-y-3 pl-2 border-l-2 border-slate-200 mt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Answer Choices & Correct Option</label>
                            <button
                              type="button"
                              onClick={() => handleAddOptionField(q.id)}
                              className="text-[10px] font-bold text-[#0A2540] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Choice
                            </button>
                          </div>

                          <div className="space-y-2.5">
                            {q.options.split('|').map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2.5">
                                {/* Correct option selection radio */}
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={String(q.correctOption) === String(optIdx)}
                                  onChange={() => handleUpdateQuestion(q.id, 'correctOption', String(optIdx))}
                                  className="accent-[#0A2540] w-3.5 h-3.5 cursor-pointer"
                                  title="Mark as correct answer"
                                />
                                
                                {/* Option text input */}
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(q.id, optIdx, e.target.value)}
                                  placeholder={`Choice ${optIdx + 1}...`}
                                  className={`flex-1 p-2 border text-xs outline-none rounded-sm ${
                                    String(q.correctOption) === String(optIdx)
                                      ? 'border-emerald-500 bg-emerald-50/20 text-[#0a2540] font-semibold'
                                      : 'border-[#cbd5e0] bg-white text-slate-700 focus:border-[#D4AF37]'
                                  }`}
                                />

                                {/* Remove choice button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionField(q.id, optIdx)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-sm transition-colors cursor-pointer"
                                  title="Remove Choice"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Model Reference Answer / Grading Key</label>
                          <textarea
                            value={q.correctOption}
                            onChange={(e) => handleUpdateQuestion(q.id, 'correctOption', e.target.value)}
                            placeholder="Write the expected correct criteria, keywords, or full model answer to assist in grading..."
                            rows={3}
                            className="w-full p-2.5 border border-[#cbd5e0] rounded-sm text-xs text-slate-800 outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Save action section */}
                  <div className="p-4 bg-slate-50 border border-[#cbd5e0] rounded-sm flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold text-neutral-500 italic">
                      * Saving will replace all existing questions for this category test track.
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={fetchTests}
                        className="py-2 px-4 bg-white hover:bg-slate-100 border border-[#cbd5e0] text-xs font-bold text-slate-700 uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                      >
                        Reset Draft
                      </button>
                      <button
                        onClick={handleSaveTest}
                        className="py-2 px-5 bg-[#D4AF37] hover:bg-[#c5a059] border border-[#D4AF37] text-xs font-bold text-[#0A2540] uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'grade_submissions' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 bg-white border border-[#cbd5e0] rounded-sm shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-serif font-bold text-[#0A2540]">Student Submissions Log</h2>
                <p className="text-neutral-555 text-xs mt-1">
                  Grade MCQ & short-answer module tests, evaluate student entries, and authorize PDF certificate generation.
                </p>
              </div>

              {/* Status Filter Tab Buttons */}
              <div className="flex border border-[#cbd5e0] rounded overflow-hidden select-none bg-slate-50">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-[#0A2540] text-white'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  All ({submissions.length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    filterStatus === 'pending'
                      ? 'bg-[#0A2540] text-white'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  Pending ({submissions.filter(s => s.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilterStatus('graded')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    filterStatus === 'graded'
                      ? 'bg-[#0A2540] text-white'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  Graded ({submissions.filter(s => s.status === 'graded').length})
                </button>
              </div>
            </div>
          </div>

          {loadingSubmissions ? (
            <div className="p-12 text-center bg-white border border-[#cbd5e0] rounded-sm shadow-sm">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0A2540] mb-2" />
              <p className="text-xs text-neutral-500">Loading user submissions...</p>
            </div>
          ) : (
            <div className="p-5 bg-white border border-[#cbd5e0] rounded-sm shadow-sm">
              {filteredSubmissions.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 font-mono">
                  No submissions match this filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#cbd5e0] bg-[#f8fafc] text-neutral-600 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Student Name</th>
                        <th className="py-3 px-3">Module Category</th>
                        <th className="py-3 px-3">MCQ Result</th>
                        <th className="py-3 px-3">Submission Date</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-[#cbd5e0] hover:bg-neutral-50 text-[#2d3748] items-center">
                          <td className="py-3.5 px-3">
                            <div className="font-serif font-bold text-[#0A2540]">{sub.user?.name}</div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">{sub.user?.email}</div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-neutral-500">{sub.test?.category}</td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-[#0a2540]">{getMCQScoreText(sub)}</td>
                          <td className="py-3.5 px-3 text-neutral-500 font-mono">
                            {new Date(sub.updatedAt).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3">
                            {sub.status === 'pending' ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                Pending
                              </span>
                            ) : sub.passed ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Passed ({sub.score}%)
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                                Failed ({sub.score}%)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {sub.status === 'pending' ? (
                              <button
                                onClick={() => handleOpenGradingModal(sub)}
                                className="py-1 px-3 bg-[#D4AF37] hover:bg-[#c5a059] text-[#0A2540] text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer border border-[#D4AF37]"
                              >
                                Grade Now
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenGradingModal(sub)}
                                className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer border border-slate-350"
                              >
                                Re-Grade
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#cbd5e0] p-8 rounded-sm shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button 
              onClick={() => setGradingSubmission(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0A2540]">Grade Assessment Submission</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-600">Student: {gradingSubmission.user?.name} ({gradingSubmission.user?.email})</span>
                <span>•</span>
                <span>Category: {gradingSubmission.test?.category}</span>
                <span>•</span>
                <span className="font-mono">Submitted: {new Date(gradingSubmission.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Questions list side-by-side with student answers */}
            <div className="space-y-4 border-t border-b border-[#edf2f7] py-4 overflow-y-auto max-h-[45vh] pr-2">
              {(() => {
                let studentAnswers = {};
                try {
                  studentAnswers = JSON.parse(gradingSubmission.answers || '{}');
                } catch(e) {}

                return gradingSubmission.test?.questions.map((q, idx) => {
                  const studentAns = studentAnswers[q.id];
                  const isMcqCorrect = q.type === 'MCQ' && String(studentAns).trim() === String(q.correctOption).trim();

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3.5">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-[#0A2540] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-[#0A2540] leading-normal">{q.questionText}</p>
                      </div>

                      {q.type === 'MCQ' ? (
                        <div className="pl-7 space-y-2">
                          <div className="grid grid-cols-1 gap-1.5">
                            {q.options.split('|').map((opt, optIdx) => {
                              const isSelected = String(studentAns) === String(optIdx);
                              const isCorrect = String(q.correctOption) === String(optIdx);
                              
                              let classes = 'border-slate-200 bg-white text-slate-700';
                              if (isSelected) {
                                classes = isCorrect 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                                  : 'border-red-500 bg-red-50 text-red-800 font-semibold';
                              } else if (isCorrect) {
                                classes = 'border-emerald-500/50 bg-emerald-50/10 text-emerald-700 border-dashed';
                              }

                              return (
                                <div key={optIdx} className={`p-2 border rounded-sm text-xs flex items-center justify-between ${classes}`}>
                                  <span className="flex items-center gap-2">
                                    <input 
                                      type="radio" 
                                      disabled 
                                      checked={isSelected}
                                      className="accent-[#0A2540] w-3 h-3"
                                    />
                                    <span>{opt}</span>
                                  </span>
                                  {isSelected && (
                                    isCorrect 
                                      ? <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      : <X className="w-3.5 h-3.5 text-red-650" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-[10px] font-bold flex items-center gap-1.5">
                            {isMcqCorrect ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Autograded Correct (+1)
                              </span>
                            ) : (
                              <span className="text-red-650 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> Autograded Incorrect (+0)
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="pl-7 space-y-3">
                          {/* Student Answer */}
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-neutral-555 uppercase tracking-wider block">Student Response</span>
                            <div className="p-3 bg-white border border-slate-350 rounded text-xs text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                              {studentAns || <em className="text-neutral-450 italic">No answer submitted</em>}
                            </div>
                          </div>

                          {/* Reference Guide */}
                          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-sm text-xs leading-relaxed">
                            <span className="font-bold text-blue-900 block mb-0.5">💡 Grading Reference Guideline:</span>
                            <p className="italic">{q.correctOption || 'No reference set.'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSubmitGrade} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Score */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Score Percentage (0 - 100)</label>
                  <input
                    type="number"
                    value={gradeScore}
                    onChange={(e) => handleScoreChange(e.target.value)}
                    min="0"
                    max="100"
                    placeholder="Enter compliance score percentage..."
                    className="w-full p-2.5 border border-[#cbd5e0] rounded-sm text-xs text-slate-800 outline-none focus:border-[#D4AF37]"
                    required
                  />
                  <span className="text-[9px] text-neutral-555 block italic">
                    * Minimum passing score is 70%
                  </span>
                </div>

                {/* Status Passed */}
                <div className="flex items-center pt-2 select-none">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gradePassed}
                      onChange={(e) => setGradePassed(e.target.checked)}
                      className="accent-[#0A2540] w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0A2540] block">Authorize Passing Status</span>
                      <span className="text-[10px] text-neutral-500 leading-normal block">
                        Unlock compliance certificate for download.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Evaluator Feedback</label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Provide assessment feedback or improvement notes to the student..."
                  rows={3}
                  className="w-full p-2.5 border border-[#cbd5e0] rounded-sm text-xs text-slate-800 outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="py-2.5 px-4 bg-white hover:bg-slate-100 border border-[#cbd5e0] text-xs font-bold text-slate-700 uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="py-2.5 px-5 bg-[#0A2540] hover:bg-[#001f4d] border border-[#0A2540] text-xs font-bold text-white uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {submittingGrade ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" /> Submitting...
                    </>
                  ) : (
                    'Submit Grade'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
