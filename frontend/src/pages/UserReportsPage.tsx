import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flag, MapPin, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '../api/adminApi';
import type { Report } from '../types';
import EmptyState from '../components/common/EmptyState';

export default function UserReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAllReports()
      .then(res => setReports(res.filter(r => r.userId === 'u-1')))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
      case 'investigating':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80"><AlertCircle className="w-3.5 h-3.5" /> Under Investigation</span>;
      case 'resolved':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80"><CheckCircle className="w-3.5 h-3.5" /> Resolved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/80"><XCircle className="w-3.5 h-3.5" /> Closed</span>;
    }
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-surface-200/80">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Flag className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">My Submitted Reports</h1>
            <p className="text-sm font-medium text-surface-500 mt-1">Track resolution progress for center information updates</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 border border-surface-200/80 h-28" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={<Flag className="w-10 h-10 text-surface-400" />}
            title="No reports submitted"
            description="If you find incorrect addresses, closed facilities, or wrong phone numbers, report them on the Center Details page."
            actionLabel="Explore Centers"
            onAction={() => window.location.href = '/explore'}
          />
        ) : (
          <div className="space-y-5">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-7 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-100">
                  <div>
                    <Link to={`/center/${report.centerId}`} className="font-bold text-lg text-surface-900 hover:text-eco-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-eco-700 shrink-0" />
                      <span>{report.centerName}</span>
                    </Link>
                    <p className="text-xs font-semibold text-surface-400 mt-1">
                      Report Type: <span className="text-surface-700 capitalize">{report.type.replace('_', ' ')}</span> • {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {getStatusBadge(report.status)}
                </div>

                <p className="text-sm text-surface-700 leading-relaxed font-normal">{report.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
