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
    <div className="py-24 sm:py-32 lg:py-40 min-h-screen bg-ambient-light">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16 pb-10 border-b border-[#eaeae4]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">SEARCH ACTIVITY</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#1b251f] tracking-tight">Search History</h1>
              <p className="text-base font-medium text-[#556358] mt-1">{history.length} past searches saved</p>
            </div>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="md" leftIcon={<TrashIcon className="w-4 h-4" />} onClick={handleClearAll}>
              Clear History
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/80 rounded-3xl p-8 border border-[#eaeae4]">
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-stone-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/3 bg-stone-200 rounded-lg" />
                    <div className="h-4 w-1/4 bg-stone-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={<Search className="w-12 h-12 text-blue-600" />}
            title="No search history"
            description="Your recent search queries will appear here so you can quickly revisit them anytime."
            actionLabel="Start Searching"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-6">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-3xl border border-white/80 p-7 sm:p-8 flex items-center justify-between gap-8 group hover:border-[#22c55e]/40 shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#ebf5ed] flex items-center justify-center text-[#143e2b] shrink-0 font-bold">
                    <Compass className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-lg font-bold text-[#1b251f] truncate">{item.query}</p>
                    <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold text-[#556358]">
                      <span className="px-3.5 py-1 rounded-full bg-[#ebf5ed] text-[#143e2b] font-extrabold border border-[#22c55e]/30">{item.wasteType}</span>
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => navigate(`/explore?waste=${item.wasteType}`)}
                    className="p-3.5 rounded-2xl bg-[#ebf5ed] hover:bg-[#143e2b] text-[#143e2b] hover:text-white transition-all cursor-pointer shadow-2xs"
                    aria-label="Search again"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all cursor-pointer shadow-2xs"
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


