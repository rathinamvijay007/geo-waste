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
    adminApi
      .getAllReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleFlag = async (id: string) => {
    try {
      await adminApi.flagReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'flagged' } : r))
      );
      showToast('info', 'Review flagged for inspection.');
    } catch {
      showToast('error', 'Failed to flag review.');
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this review?')) return;
    try {
      await adminApi.removeReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('success', 'Review removed.');
    } catch {
      showToast('error', 'Failed to remove review.');
    }
  };

  return (
    <AdminLayout
      title="Review Moderation"
      description="Monitor and moderate user reviews across centers"
    >
      {loading ? (
        <LoadingSpinner text="Loading reviews..." />
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-7 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-[#edf7ee] text-base">
                    {review.userName}
                  </span>
                  <span className="text-xs text-[#edf7ee]/50">reviewed</span>
                  <span className="font-extrabold text-[#4ade80] text-base">
                    {review.centerName}
                  </span>
                  {review.status === 'flagged' && (
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      FLAGGED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= review.rating
                          ? 'text-[#4ade80] fill-[#4ade80]'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-[#edf7ee]/40 font-medium ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[15px] text-[#edf7ee]/80 leading-relaxed font-normal">
                  {review.comment}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                {review.status !== 'flagged' && (
                  <button
                    onClick={() => handleFlag(review.id)}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-all border border-amber-500/30 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" /> Flag
                  </button>
                )}
                <button
                  onClick={() => handleRemove(review.id)}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-sm"
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
