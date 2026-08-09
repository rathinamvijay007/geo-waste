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
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl border border-surface-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-surface-900 text-sm">{review.userName}</span>
                  <span className="text-xs text-surface-400">reviewed</span>
                  <span className="font-semibold text-eco-700 text-sm">{review.centerName}</span>
                  {review.status === 'flagged' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      FLAGGED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                  ))}
                  <span className="text-xs text-surface-400 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-surface-700">{review.comment}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {review.status !== 'flagged' && (
                  <button
                    onClick={() => handleFlag(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" /> Flag
                  </button>
                )}
                <button
                  onClick={() => handleRemove(review.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
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
