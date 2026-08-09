import { useEffect, useState } from 'react';
import { Star, Flag, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import type { Review } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showToast } from '../../components/common/Toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAllReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleFlag = async (id: string) => {
    try {
      await adminApi.flagReview(id);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'flagged' } : r));
      showToast('info', 'Review flagged for inspection.');
    } catch {
      showToast('error', 'Failed to flag review.');
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this review?')) return;
    try {
      await adminApi.removeReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('success', 'Review removed.');
    } catch {
      showToast('error', 'Failed to remove review.');
    }
  };

  return (
    <AdminLayout title="Review Moderation" description="Monitor and moderate user reviews across centers">
      {loading ? (
        <LoadingSpinner text="Loading reviews..." />
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="glass-card rounded-3xl border border-white/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-[#1b251f] text-sm">{review.userName}</span>
                  <span className="text-xs text-[#788a7e]">reviewed</span>
                  <span className="font-extrabold text-[#143e2b] text-sm">{review.centerName}</span>
                  {review.status === 'flagged' && (
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-800 border border-amber-500/30">
                      FLAGGED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`} />
                  ))}
                  <span className="text-xs text-[#788a7e] font-semibold ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[#4a554e] leading-relaxed font-medium">{review.comment}</p>
              </div>

              <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                {review.status !== 'flagged' && (
                  <button
                    onClick={() => handleFlag(review.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-amber-800 bg-amber-500/10 hover:bg-amber-500/20 transition-all border border-amber-500/30 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" /> Flag
                  </button>
                )}
                <button
                  onClick={() => handleRemove(review.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

