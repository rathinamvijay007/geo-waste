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
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100', link: '/admin/users' },
    { label: 'Total Centers', value: stats.totalCenters, icon: MapPin, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', link: '/admin/centers' },
    { label: 'Verified Centers', value: stats.verifiedCenters, icon: ShieldCheck, color: 'bg-eco-50 text-eco-700 border-eco-200/60', link: '/admin/centers' },
    { label: 'Pending Verification', value: stats.pendingVerification, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100', link: '/admin/centers' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: Star, color: 'bg-purple-50 text-purple-600 border-purple-100', link: '/admin/reviews' },
    { label: 'Center Reports', value: stats.totalReports, icon: Flag, color: 'bg-rose-50 text-rose-600 border-rose-100', link: '/admin/reports' },
  ];

  return (
    <AdminLayout title="Admin Dashboard" description="Overview of platform metrics, collection centers, and user activity">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
        {statCards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-3xl border border-surface-200/80 p-5 hover:border-eco-300 hover:shadow-md transition-all duration-300 group shadow-2xs"
          >
            <div className={`w-10 h-10 rounded-2xl ${card.color} border flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-surface-900 tracking-tight">{card.value.toLocaleString()}</p>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pending Actions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-100">
            <div>
              <h3 className="font-bold text-surface-900 text-lg">Recent Flagged Reports</h3>
              <p className="text-xs font-medium text-surface-500 mt-0.5">Reports submitted by users requiring admin review</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-eco-700 hover:text-eco-900 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentReports.map(rep => (
              <div key={rep.id} className="flex items-start justify-between p-5 rounded-2xl border border-surface-200/60 bg-surface-50/60 gap-4">
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-surface-900">{rep.centerName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      rep.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      rep.status === 'investigating' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 leading-relaxed font-normal">{rep.description}</p>
                  <p className="text-xs font-medium text-surface-400">Reported by {rep.userName} • {new Date(rep.createdAt).toLocaleDateString()}</p>
                </div>
                <Link to="/admin/reports" className="text-xs font-bold text-eco-700 hover:bg-eco-50 px-3.5 py-2 rounded-xl transition-colors shrink-0 border border-eco-200/60 bg-white">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs space-y-6">
            <h3 className="font-bold text-surface-900 text-lg flex items-center gap-2.5 pb-4 border-b border-surface-100">
              <Activity className="w-5 h-5 text-eco-700" /> Quick Operations
            </h3>
            <div className="space-y-3">
              <Link to="/admin/centers" className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-50 text-sm font-semibold text-surface-800 transition-colors border border-surface-200/60">
                <span>Manage Collection Centers</span>
                <ArrowRight className="w-4 h-4 text-surface-400" />
              </Link>
              <Link to="/admin/reports" className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-50 text-sm font-semibold text-surface-800 transition-colors border border-surface-200/60">
                <span>Review User Reports ({stats.pendingReports} pending)</span>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              </Link>
              <Link to="/admin/analytics" className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-50 text-sm font-semibold text-surface-800 transition-colors border border-surface-200/60">
                <span>View Platform Analytics</span>
                <ArrowRight className="w-4 h-4 text-surface-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
