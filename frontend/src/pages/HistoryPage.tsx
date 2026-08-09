import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, Trash2, TrashIcon, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { historyApi } from '../api/historyApi';
import type { SearchHistoryItem } from '../types';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { showToast } from '../components/common/Toast';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    historyApi.getHistory().then(setHistory).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await historyApi.deleteHistoryItem(id);
    setHistory(prev => prev.filter(h => h.id !== id));
    showToast('success', 'Search removed.');
  };

  const handleClearAll = async () => {
    await historyApi.clearHistory();
    setHistory([]);
    showToast('success', 'Search history cleared.');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-surface-200/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Search History</h1>
              <p className="text-sm font-medium text-surface-500 mt-1">{history.length} past searches saved</p>
            </div>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="md" leftIcon={<TrashIcon className="w-4 h-4" />} onClick={handleClearAll}>
              Clear History
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-surface-200/80">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-1/3 bg-surface-200 rounded-lg" />
                    <div className="h-4 w-1/4 bg-surface-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={<Search className="w-10 h-10 text-surface-400" />}
            title="No search history"
            description="Your recent search queries will appear here so you can quickly revisit them anytime."
            actionLabel="Start Searching"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-4">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-3xl border border-surface-200/80 p-6 flex items-center justify-between gap-6 group hover:border-eco-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-600 shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-base font-bold text-surface-900 truncate">{item.query}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-surface-500">
                      <span className="px-2.5 py-0.5 rounded-full bg-eco-50 text-eco-800 font-semibold border border-eco-200/60">{item.wasteType}</span>
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/explore?waste=${item.wasteType}`)}
                    className="p-2.5 rounded-xl hover:bg-eco-50 text-eco-700 transition-colors cursor-pointer"
                    aria-label="Search again"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                    aria-label="Delete search"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
