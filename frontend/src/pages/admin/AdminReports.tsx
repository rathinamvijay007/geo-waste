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
      <div className="bg-white rounded-2xl border border-surface-200 p-4 mb-6 flex gap-2 overflow-x-auto">
        {['All', 'Pending', 'Investigating', 'Resolved', 'Rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === st ? 'bg-eco-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
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
            <div key={report.id} className="bg-white rounded-2xl border border-surface-200 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-surface-900">{report.centerName}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-200 text-surface-700'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-medium text-surface-500">Report Issue: <span className="text-surface-800">{report.type.replace('_', ' ')}</span></p>
                <p className="text-sm text-surface-700 bg-surface-50 p-3 rounded-xl border border-surface-100">{report.description}</p>
                <p className="text-[11px] text-surface-400">Reported by {report.userName} on {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>

              {report.status !== 'resolved' && report.status !== 'rejected' && (
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                  <button
                    onClick={() => handleReject(report.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-surface-700 bg-surface-100 hover:bg-surface-200 transition-colors"
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
