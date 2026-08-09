import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flag, MapPin, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '../api/adminApi';
import type { Report } from '../types';
import EmptyState from '../components/common/EmptyState';

export default function UserReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getAllReports()
      .then(res => setReports(res.filter(r => r.userId === 'u-1')))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-800 border border-amber-500/30"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
      case 'investigating':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-800 border border-blue-500/30"><AlertCircle className="w-3.5 h-3.5" /> Under Investigation</span>;
      case 'resolved':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#ebf5ed] text-[#143e2b] border border-[#22c55e]/30"><CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" /> Resolved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-200/80"><XCircle className="w-3.5 h-3.5 text-rose-600" /> Closed</span>;
    }
  };

  return (
    <div className="py-24 sm:py-32 lg:py-40 min-h-screen bg-ambient-light">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-6 mb-16 pb-10 border-b border-[#eaeae4]">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-md">
            <Flag className="w-8 h-8 text-amber-700" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">FACILITY CORRECTIONS</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#1b251f] tracking-tight">Submitted Reports</h1>
            <p className="text-base font-medium text-[#556358] mt-1">{reports.length} reports filed for review</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/80 rounded-3xl p-8 border border-[#eaeae4] space-y-4">
                <div className="h-6 w-1/3 bg-stone-200 rounded-lg" />
                <div className="h-4 w-full bg-stone-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={<Flag className="w-12 h-12 text-amber-600" />}
            title="No reports submitted"
            description="If you encounter incorrect facility details, operating hours, or addresses, you can file a report anytime."
            actionLabel="Explore Centers"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-6">
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-3xl border border-white/80 p-8 sm:p-10 shadow-lg space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Link to={`/center/${report.centerId}`} className="font-extrabold font-display text-xl text-[#1b251f] hover:text-[#143e2b] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#22c55e]" />
                      <span>{report.centerName}</span>
                    </Link>
                    <p className="text-xs font-semibold text-[#788a7e] mt-1">
                      Type: <span className="font-bold text-[#1b251f] capitalize">{report.type.replace('_', ' ')}</span> • {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                <p className="text-base text-[#4a554e] leading-relaxed font-medium bg-white/80 p-5 rounded-2xl border border-[#eaeae4]">{report.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


