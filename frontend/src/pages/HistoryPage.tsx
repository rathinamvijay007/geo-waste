import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, Trash2, TrashIcon, Compass, Sparkles } from 'lucide-react';
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
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16 lg:mb-20 pb-10 border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-[#4ade80]/10 border border-[#4ade80]/30 flex items-center justify-center shrink-0 shadow-lg">
              <Clock className="w-8 h-8 text-[#4ade80]" />
            </div>
            <div>
              <div className="eyebrow mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>SEARCH ACTIVITY</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#edf7ee]">
                Search <span className="gradient-text">History</span>
              </h1>
              <p className="text-sm font-medium text-[#edf7ee]/60 mt-1">{history.length} past searches saved</p>
            </div>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="md" leftIcon={<TrashIcon className="w-4 h-4" />} onClick={handleClearAll}>
              Clear History
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#0d1611]/80 rounded-3xl p-7 sm:p-8 border border-white/10">
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/3 bg-white/10 rounded-lg" />
                    <div className="h-4 w-1/4 bg-white/5 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={<Search className="w-12 h-12 text-[#4ade80]" />}
            title="No search history"
            description="Your recent search queries will appear here so you can quickly revisit them anytime."
            actionLabel="Start Searching"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-5">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-7 sm:p-8 flex items-center justify-between gap-6 group hover:border-[#4ade80]/40 shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center text-[#4ade80] shrink-0 font-bold">
                    <Compass className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-base sm:text-lg font-bold text-[#edf7ee] truncate">{item.query}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#edf7ee]/60">
                      <span className="px-3 py-1 rounded-full bg-[#4ade80]/15 text-[#4ade80] font-mono font-bold border border-[#4ade80]/30">{item.wasteType}</span>
                      <span>{item.location}</span>
                      <span className="text-white/20">•</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => navigate(`/explore?waste=${item.wasteType}`)}
                    className="p-4 rounded-2xl bg-[#4ade80]/10 hover:bg-[#22c55e] border border-[#4ade80]/25 text-[#4ade80] hover:text-[#052e16] transition-all cursor-pointer shadow-md"
                    aria-label="Search again"
                  >
                    <Search className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white transition-all cursor-pointer shadow-md"
                    aria-label="Delete search"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
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
