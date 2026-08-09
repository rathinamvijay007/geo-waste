import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, MapPin, ShieldCheck, Clock, Star, Flag, ArrowRight, Activity, AlertCircle
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import type { AdminStats, Report } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getAllReports()])
      .then(([statsData, reportsData]) => {
        setStats(statsData);
        setRecentReports(reportsData.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout title="Admin Dashboard" description="Overview of platform metrics and activity">
        <LoadingSpinner text="Loading admin stats..." />
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500/10 text-blue-700 border-blue-500/30', link: '/admin/users' },
    { label: 'Total Centers', value: stats.totalCenters, icon: MapPin, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30', link: '/admin/centers' },
    { label: 'Verified Centers', value: stats.verifiedCenters, icon: ShieldCheck, color: 'bg-[#ebf5ed] text-[#143e2b] border-[#22c55e]/30', link: '/admin/centers' },
    { label: 'Pending Verification', value: stats.pendingVerification, icon: Clock, color: 'bg-amber-500/10 text-amber-700 border-amber-500/30', link: '/admin/centers' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: Star, color: 'bg-purple-500/10 text-purple-700 border-purple-500/30', link: '/admin/reviews' },
    { label: 'Center Reports', value: stats.totalReports, icon: Flag, color: 'bg-rose-500/10 text-rose-700 border-rose-500/30', link: '/admin/reports' },
  ];

  return (
    <AdminLayout title="Admin Dashboard" description="Overview of platform metrics, collection centers, and user activity">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
        {statCards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            className="glass-card rounded-3xl p-5 border border-white/80 hover:border-[#22c55e]/40 shadow-md transition-all duration-300 group space-y-3"
          >
            <div className={`w-11 h-11 rounded-2xl ${card.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black font-display text-[#1b251f] tracking-tight">{card.value.toLocaleString()}</p>
              <p className="text-[10px] font-extrabold text-[#556358] uppercase tracking-widest mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pending Actions */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 shadow-xl space-y-6 border border-white/80">
          <div className="flex items-center justify-between pb-4 border-b border-[#eaeae4]">
            <div>
              <h3 className="font-extrabold font-display text-[#1b251f] text-xl">Recent Flagged Reports</h3>
              <p className="text-xs font-medium text-[#556358] mt-1">Reports submitted by users requiring admin review</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-extrabold text-[#143e2b] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5 text-[#22c55e]" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentReports.map(rep => (
              <div key={rep.id} className="flex items-start justify-between p-5 rounded-2xl border border-[#eaeae4] bg-white/80 gap-4 shadow-2xs">
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-[#1b251f]">{rep.centerName}</span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      rep.status === 'pending' ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30' :
                      rep.status === 'investigating' ? 'bg-blue-500/10 text-blue-800 border border-blue-500/30' : 'bg-[#ebf5ed] text-[#143e2b] border border-[#22c55e]/30'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a554e] leading-relaxed font-medium">{rep.description}</p>
                  <p className="text-[11px] font-semibold text-[#788a7e]">Reported by {rep.userName} • {new Date(rep.createdAt).toLocaleDateString()}</p>
                </div>
                <Link to="/admin/reports" className="text-xs font-bold text-[#143e2b] bg-[#ebf5ed] hover:bg-[#143e2b] hover:text-white px-4 py-2 rounded-xl transition-all shrink-0 border border-[#22c55e]/30 shadow-2xs">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="space-y-8">
          <div className="glass-panel rounded-3xl p-8 shadow-xl space-y-6 border border-white/80">
            <h3 className="font-extrabold font-display text-[#1b251f] text-xl flex items-center gap-2.5 pb-4 border-b border-[#eaeae4]">
              <Activity className="w-5 h-5 text-[#22c55e]" /> Quick Operations
            </h3>
            <div className="space-y-3">
              <Link to="/admin/centers" className="flex items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-[#ebf5ed] text-xs font-bold text-[#1b251f] transition-colors border border-[#eaeae4]">
                <span>Manage Collection Centers</span>
                <ArrowRight className="w-4 h-4 text-[#788a7e]" />
              </Link>
              <Link to="/admin/reports" className="flex items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-[#ebf5ed] text-xs font-bold text-[#1b251f] transition-colors border border-[#eaeae4]">
                <span>Review User Reports ({stats.pendingReports} pending)</span>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              </Link>
              <Link to="/admin/analytics" className="flex items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-[#ebf5ed] text-xs font-bold text-[#1b251f] transition-colors border border-[#eaeae4]">
                <span>View Platform Analytics</span>
                <ArrowRight className="w-4 h-4 text-[#788a7e]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

