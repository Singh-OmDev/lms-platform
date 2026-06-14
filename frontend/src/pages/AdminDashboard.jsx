import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  Video, 
  Clock, 
  Activity
} from 'lucide-react';
import { api, useStore } from '../store/useStore';
import { useTranslation } from '../utils/translations';

export default function AdminDashboard() {
  const { addToast } = useStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/admin-stats');
        setStatsData(res.data);
      } catch (err) {
        console.error(err);
        addToast('Access denied or failed to retrieve admin metrics', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-neutral-300 rounded border border-[#d2d6dc]" />
          <div className="h-80 bg-neutral-350 rounded border border-[#d2d6dc]" />
        </div>
      </div>
    );
  }

  const { stats, charts } = statsData || {};

  return (
    <div className="space-y-6 pb-16 font-sans text-[#2d3748]">
      {/* Dossier Header */}
      <div className="border-b-2 border-[#d2d6dc] pb-4">
        <h1 className="text-xl font-serif font-bold text-[#0A2540] tracking-tight">{t('admin.title')}</h1>
        <p className="text-neutral-500 text-xs mt-1">
          {t('admin.subtitle')}
        </p>
      </div>

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
    </div>
  );
}
