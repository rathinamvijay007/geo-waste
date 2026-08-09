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
    adminApi.getAllReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await adminApi.resolveReport(id);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' as ReportStatus } : r));
      showToast('success', 'Report marked as resolved.');
    } catch {
      showToast('error', 'Failed to resolve report.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectReport(id);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as ReportStatus } : r));
      showToast('info', 'Report rejected.');
    } catch {
      showToast('error', 'Failed to reject report.');
    }
  };

  const filteredReports = reports.filter(r =>
    filterStatus === 'All' || r.status === filterStatus.toLowerCase()
  );

  return (
    <AdminLayout title="Center Reports" description="Investigate and resolve user reports about incorrect information">
      {/* Filter status */}
      <div className="glass-card rounded-3xl border border-white/80 p-5 mb-8 flex gap-2.5 overflow-x-auto shadow-md">
        {['All', 'Pending', 'Investigating', 'Resolved', 'Rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              filterStatus === st ? 'bg-[#143e2b] text-white shadow-md' : 'bg-white/80 text-[#4a554e] border border-[#eaeae4] hover:bg-[#ebf5ed]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading reports..." />
      ) : (
        <div className="space-y-4">
          {filteredReports.map(report => (
            <div key={report.id} className="glass-card rounded-3xl border border-white/80 p-7 flex flex-col md:flex-row md:items-start justify-between gap-5 shadow-md">
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-extrabold font-display text-[#1b251f] text-base">{report.centerName}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                    report.status === 'pending' ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30' :
                    report.status === 'investigating' ? 'bg-blue-500/10 text-blue-800 border border-blue-500/30' :
                    report.status === 'resolved' ? 'bg-[#ebf5ed] text-[#143e2b] border border-[#22c55e]/30' : 'bg-stone-100 text-stone-700 border border-[#eaeae4]'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#556358]">Report Issue: <span className="text-[#1b251f] font-bold capitalize">{report.type.replace('_', ' ')}</span></p>
                <p className="text-xs text-[#4a554e] bg-white/80 p-4 rounded-2xl border border-[#eaeae4] leading-relaxed font-medium">{report.description}</p>
                <p className="text-[11px] font-semibold text-[#788a7e]">Reported by {report.userName} on {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>

              {report.status !== 'resolved' && report.status !== 'rejected' && (
                <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#143e2b] hover:bg-[#22c55e] transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                  <button
                    onClick={() => handleReject(report.id)}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold text-[#4a554e] bg-white hover:bg-stone-100 transition-all border border-[#eaeae4] cursor-pointer"
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

