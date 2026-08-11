import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flag,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '../api/adminApi';
import type { Report } from '../types';
import EmptyState from '../components/common/EmptyState';

export default function UserReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi
      .getAllReports()
      .then((res) => setReports(res.filter((r) => r.userId === 'u-1')))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Review
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-sky-400" /> Under
            Investigation
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30">
            <CheckCircle className="w-3.5 h-3.5 text-[#4ade80]" /> Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Closed
          </span>
        );
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-6 mb-16 lg:mb-20 pb-10 border-b border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg">
            <Flag className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="eyebrow mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>FACILITY CORRECTIONS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#edf7ee]">
              Submitted <span className="gradient-text">Reports</span>
            </h1>
            <p className="text-sm font-medium text-[#edf7ee]/60 mt-1">
              {reports.length} reports filed for review
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#0d1611]/80 rounded-3xl p-8 border border-white/10 space-y-4"
              >
                <div className="h-6 w-1/3 bg-white/10 rounded-lg" />
                <div className="h-4 w-full bg-white/5 rounded-lg" />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={<Flag className="w-12 h-12 text-amber-400" />}
            title="No reports submitted"
            description="If you encounter incorrect facility details, operating hours, or addresses, you can file a report anytime."
            actionLabel="Explore Centers"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-5">
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-7 sm:p-9 shadow-lg space-y-5 hover:border-[#4ade80]/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Link
                      to={`/center/${report.centerId}`}
                      className="font-extrabold font-display text-xl text-[#edf7ee] hover:text-[#4ade80] flex items-center gap-2 transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-[#4ade80]" />
                      <span>{report.centerName}</span>
                    </Link>
                    <p className="text-xs font-semibold text-[#edf7ee]/50 mt-1.5">
                      Type:{' '}
                      <span className="font-bold text-[#edf7ee] capitalize">
                        {report.type.replace('_', ' ')}
                      </span>{' '}
                      •{' '}
                      {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                <p className="text-[15px] text-[#edf7ee]/80 leading-relaxed font-normal bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
                  {report.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
