import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import type { Report, ReportStatus } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showToast } from '../../components/common/Toast';

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    adminApi
      .getAllReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await adminApi.resolveReport(id);
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'resolved' as ReportStatus } : r
        )
      );
      showToast('success', 'Report marked as resolved.');
    } catch {
      showToast('error', 'Failed to resolve report.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectReport(id);
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'rejected' as ReportStatus } : r
        )
      );
      showToast('info', 'Report rejected.');
    } catch {
      showToast('error', 'Failed to reject report.');
    }
  };

  const filteredReports = reports.filter(
    (r) => filterStatus === 'All' || r.status === filterStatus.toLowerCase()
  );

  return (
    <AdminLayout
      title="Center Reports"
      description="Investigate and resolve user reports about incorrect information"
    >
      {/* Filter status */}
      <div className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-10 flex gap-2.5 overflow-x-auto shadow-lg">
        {['All', 'Pending', 'Investigating', 'Resolved', 'Rejected'].map(
          (st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#22c55e] text-[#052e16] shadow-md font-extrabold'
                  : 'bg-white/5 text-[#edf7ee]/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          )
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading reports..." />
      ) : (
        <div className="space-y-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-7 sm:p-9 flex flex-col md:flex-row md:items-start justify-between gap-6 shadow-lg"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-extrabold font-display text-[#edf7ee] text-lg">
                    {report.centerName}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest ${
                      report.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : report.status === 'investigating'
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                        : report.status === 'resolved'
                        ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30'
                        : 'bg-white/5 text-[#edf7ee]/60 border border-white/10'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#edf7ee]/60">
                  Report Issue:{' '}
                  <span className="text-[#edf7ee] font-bold capitalize">
                    {report.type.replace('_', ' ')}
                  </span>
                </p>
                <p className="text-xs text-[#edf7ee]/80 bg-white/5 p-5 rounded-2xl border border-white/10 leading-relaxed font-normal">
                  {report.description}
                </p>
                <p className="text-[11px] font-medium text-[#edf7ee]/40">
                  Reported by {report.userName} on{' '}
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>

              {report.status !== 'resolved' &&
                report.status !== 'rejected' && (
                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold text-[#052e16] bg-[#22c55e] hover:bg-[#4ade80] transition-all cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve
                    </button>
                    <button
                      onClick={() => handleReject(report.id)}
                      className="flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold text-[#edf7ee]/80 bg-white/5 hover:bg-white/10 transition-all border border-white/10 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
