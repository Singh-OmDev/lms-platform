import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Play, 
  Video, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight
} from 'lucide-react';
import { api, useStore } from '../store/useStore';

const COLORS = ['#002C6C', '#3182CE', '#718096', '#CBD5E0'];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, addToast } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/stats');
        setDashboardData(res.data);

        const resVideos = await api.get('/videos');
        const inProgress = resVideos.data.filter(
          v => v.progress && !v.progress.completed && v.progress.currentTime > 0
        );
        const notStarted = resVideos.data.filter(
          v => !v.progress || (!v.progress.completed && v.progress.currentTime === 0)
        );

        setContinueWatching(inProgress);
        setRecommended(notStarted.slice(0, 3));
      } catch (err) {
        console.error(err);
        addToast('Failed to fetch dashboard data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-neutral-300 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-neutral-300 rounded border border-[#d2d6dc]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-neutral-300 rounded border border-[#d2d6dc]" />
          <div className="h-80 bg-neutral-300 rounded border border-[#d2d6dc]" />
        </div>
      </div>
    );
  }

  const { stats, charts, recentActivities } = dashboardData || {};

  return (
    <div className="space-y-6 pb-12 font-sans text-[#2d3748]">
      {/* Dossier Header */}
      <div className="border-b-2 border-[#d2d6dc] pb-4">
        <h1 className="text-xl font-serif font-bold text-[#002c6c] tracking-tight">Student Learning Dossier</h1>
        <p className="text-neutral-500 text-xs mt-1">
          Review your course progression, registered training hours, and active milestones.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Videos */}
        <div className="border-l-4 border-l-[#002c6c] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-550 uppercase tracking-wider block">Total Courses</span>
            <h3 className="text-2xl font-serif font-bold text-[#002c6c]">{stats?.totalVideos || 0}</h3>
          </div>
          <Video className="w-5 h-5 text-[#002c6c]" />
        </div>

        {/* Videos Completed */}
        <div className="border-l-4 border-l-[#002c6c] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">Completed</span>
            <h3 className="text-2xl font-serif font-bold text-[#002c6c]">{stats?.videosCompleted || 0}</h3>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        {/* In Progress */}
        <div className="border-l-4 border-l-[#002c6c] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">In Progress</span>
            <h3 className="text-2xl font-serif font-bold text-[#002c6c]">{stats?.videosInProgress || 0}</h3>
          </div>
          <Clock className="w-5 h-5 text-[#002c6c]" />
        </div>

        {/* Completion % */}
        <div className="border-l-4 border-l-[#002c6c] border border-[#cbd5e0] bg-white p-5 flex items-center justify-between rounded-sm shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-555 uppercase tracking-wider block">Completion Rate</span>
            <h3 className="text-2xl font-serif font-bold text-[#002c6c]">{stats?.completionRate || 0}%</h3>
          </div>
          <TrendingUp className="w-5 h-5 text-[#002c6c]" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Curve */}
        <div className="lg:col-span-2 p-5 rounded-sm border border-[#cbd5e0] bg-white flex flex-col h-80 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
            <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider">Weekly Attendance Registry</h3>
            <span className="text-[10px] font-semibold text-neutral-500 font-mono">HOURS LOGGED</span>
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.weeklyProgress} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#4a5568" fontSize={10} tickLine={false} />
                <YAxis stroke="#4a5568" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e0', borderRadius: '2px' }}
                  labelClassName="text-[#002c6c] font-sans text-xs font-bold"
                  itemStyle={{ fontSize: '11px', color: '#1a202c' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#002C6C" strokeWidth={2} fillOpacity={0.08} fill="#002C6C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution */}
        <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white flex flex-col h-80 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
            <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider">Domain Enrolment</h3>
            <span className="text-[10px] font-semibold text-neutral-500 font-mono">BY TOPIC</span>
          </div>
          <div className="flex-grow w-full flex items-center justify-center">
            {charts?.categoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e0', borderRadius: '2px' }}
                    itemStyle={{ fontSize: '11px', color: '#1a202c' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="square" wrapperStyle={{ fontSize: '10px', color: '#4a5568' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-neutral-500 text-xs">No records available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Watching & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue watching row */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#002c6c] tracking-tight">Active Curriculum Modules</h3>
            {continueWatching.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {continueWatching.map((v) => (
                  <div key={v.id} className="rounded-sm border border-[#cbd5e0] overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="aspect-video relative overflow-hidden bg-neutral-100 border-b border-[#cbd5e0]">
                      <img 
                        src={v.thumbnailUrl} 
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/video/${v.id}`}
                          className="w-10 h-10 rounded-full bg-[#002c6c] text-white flex items-center justify-center hover:scale-105 transition-transform"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-neutral-500 uppercase font-mono">
                        <span>{v.category}</span>
                        <span>{Math.round(v.progress.completionPercentage)}% completed</span>
                      </div>
                      <h4 className="font-serif font-bold text-xs text-[#002c6c] truncate">{v.title}</h4>
                      <div className="w-full bg-[#e2e8f0] h-2 rounded-sm overflow-hidden border border-[#cbd5e0]">
                        <div className="bg-[#002c6c] h-full" style={{ width: `${v.progress.completionPercentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-sm border border-[#cbd5e0] bg-white text-center text-neutral-500 text-xs">
                No active training modules in progress.
              </div>
            )}
          </div>

          {/* Recommended list */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#002c6c] tracking-tight">Recommended Courses</h3>
            <div className="space-y-2">
              {recommended.map((v) => (
                <div key={v.id} className="p-3.5 rounded-sm border border-[#cbd5e0] bg-white hover:border-[#b1b7c1] hover:shadow-sm flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={v.thumbnailUrl} alt={v.title} className="w-14 h-9 object-cover rounded-sm border border-[#cbd5e0] flex-shrink-0 bg-neutral-100" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-serif font-bold text-[#002c6c] truncate">{v.title}</h4>
                      <p className="text-[9px] font-mono text-neutral-500 mt-0.5 uppercase font-semibold">{v.category} • {v.difficulty}</p>
                    </div>
                  </div>
                  <Link to={`/video/${v.id}`} className="text-[#002c6c] hover:translate-x-0.5 transition-transform flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="p-5 rounded-sm border border-[#cbd5e0] bg-white h-fit space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-xs text-[#002c6c] uppercase tracking-wider pb-2 border-b border-[#cbd5e0]">Recent Study Log</h3>
          <div className="space-y-3.5">
            {recentActivities?.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs border-b border-[#f0f4f8] pb-3 last:border-b-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-[#f2a900] mt-1.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#2d3748] leading-normal">{act.title}</p>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5 block font-semibold">{act.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-neutral-550 text-xs py-4 text-center">No recent records.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
