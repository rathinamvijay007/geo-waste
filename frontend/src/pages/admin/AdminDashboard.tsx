import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MapPin,
  ShieldCheck,
  Clock,
  Star,
  Flag,
  ArrowRight,
  Activity,
  AlertCircle,
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
      <AdminLayout
        title="Admin Dashboard"
        description="Overview of platform metrics and activity"
      >
        <LoadingSpinner text="Loading admin stats..." />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      link: '/admin/users',
    },
    {
      label: 'Total Centers',
      value: stats.totalCenters,
      icon: MapPin,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      link: '/admin/centers',
    },
    {
      label: 'Verified Centers',
      value: stats.verifiedCenters,
      icon: ShieldCheck,
      color: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20',
      link: '/admin/centers',
    },
    {
      label: 'Pending Verification',
      value: stats.pendingVerification,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      link: '/admin/centers',
    },
    {
      label: 'Total Reviews',
      value: stats.totalReviews,
      icon: Star,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      link: '/admin/reviews',
    },
    {
      label: 'Center Reports',
      value: stats.totalReports,
      icon: Flag,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      link: '/admin/reports',
    },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Overview of platform metrics, collection centers, and user activity"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-[#4ade80]/40 shadow-lg transition-all duration-300 group space-y-4"
          >
            <div
              className={`w-11 h-11 rounded-2xl ${card.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black font-display text-[#edf7ee] tracking-tight">
                {card.value.toLocaleString()}
              </p>
              <p className="text-[10px] font-mono font-bold text-[#edf7ee]/50 uppercase tracking-widest mt-1">
                {card.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Pending Actions */}
        <div className="lg:col-span-2 bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-xl space-y-7 border border-white/10">
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div>
              <h3 className="font-extrabold font-display text-[#edf7ee] text-xl">
                Recent Flagged Reports
              </h3>
              <p className="text-xs font-normal text-[#edf7ee]/60 mt-1">
                Reports submitted by users requiring admin review
              </p>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-[#4ade80] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5 text-[#4ade80]" />
            </Link>
          </div>

          <div className="space-y-5">
            {recentReports.map((rep) => (
              <div
                key={rep.id}
                className="flex items-start justify-between p-6 rounded-2xl border border-white/10 bg-white/5 gap-4 shadow-sm"
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-[#edf7ee]">
                      {rep.centerName}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest ${
                        rep.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : rep.status === 'investigating'
                          ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                          : 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#edf7ee]/70 leading-relaxed font-normal">
                    {rep.description}
                  </p>
                  <p className="text-[11px] font-medium text-[#edf7ee]/40">
                    Reported by {rep.userName} •{' '}
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to="/admin/reports"
                  className="text-xs font-bold text-[#052e16] bg-[#22c55e] hover:bg-[#4ade80] px-4 py-2 rounded-xl transition-all shrink-0 shadow-md"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="space-y-8 lg:space-y-10">
          <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-xl space-y-7 border border-white/10">
            <h3 className="font-extrabold font-display text-[#edf7ee] text-xl flex items-center gap-2.5 pb-5 border-b border-white/10">
              <Activity className="w-5 h-5 text-[#4ade80]" /> Quick Operations
            </h3>
            <div className="space-y-3.5">
              <Link
                to="/admin/centers"
                className="flex items-center justify-between p-4.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#edf7ee] transition-colors border border-white/10"
              >
                <span>Manage Collection Centers</span>
                <ArrowRight className="w-4 h-4 text-[#4ade80]" />
              </Link>
              <Link
                to="/admin/reports"
                className="flex items-center justify-between p-4.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#edf7ee] transition-colors border border-white/10"
              >
                <span>
                  Review User Reports ({stats.pendingReports} pending)
                </span>
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              </Link>
              <Link
                to="/admin/analytics"
                className="flex items-center justify-between p-4.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#edf7ee] transition-colors border border-white/10"
              >
                <span>View Platform Analytics</span>
                <ArrowRight className="w-4 h-4 text-[#4ade80]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
