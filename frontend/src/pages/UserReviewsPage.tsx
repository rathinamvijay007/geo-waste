import { useState, useEffect } from 'react';
import { MessageSquare, Star, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { reviewApi } from '../api/reviewApi';
import type { Review } from '../types';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { showToast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    reviewApi.getUserReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewApi.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('success', 'Review deleted.');
    } catch {
      showToast('error', 'Failed to delete review.');
    }
  };

  const handleOpenEdit = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    try {
      await reviewApi.updateReview(editingReview.id, { rating: editRating, comment: editComment });
      setReviews(prev => prev.map(r => r.id === editingReview.id ? { ...r, rating: editRating, comment: editComment } : r));
      setEditingReview(null);
      showToast('success', 'Review updated.');
    } catch {
      showToast('error', 'Failed to update review.');
    }
  };

  return (
    <div className="py-24 sm:py-32 lg:py-40 min-h-screen bg-ambient-light">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-6 mb-16 pb-10 border-b border-[#eaeae4]">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
            <MessageSquare className="w-8 h-8 text-blue-700" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">COMMUNITY FEEDBACK</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#1b251f] tracking-tight">My Reviews</h1>
            <p className="text-base font-medium text-[#556358] mt-1">{reviews.length} reviews published</p>
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
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12 text-blue-600" />}
            title="No reviews posted yet"
            description="Visit a drop-off center and leave a review to help the community discover verified facilities."
            actionLabel="Find Centers to Review"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-3xl border border-white/80 p-8 sm:p-10 shadow-lg space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-extrabold font-display text-xl text-[#1b251f]">{review.centerName}</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(review)}
                      className="p-3 rounded-2xl bg-white hover:bg-stone-100 text-[#556358] hover:text-[#1b251f] transition-all border border-[#eaeae4] cursor-pointer shadow-2xs"
                      title="Edit"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                      title="Delete"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4.5 h-4.5 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#788a7e] font-bold ml-2">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-base text-[#4a554e] leading-relaxed font-medium">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      <Modal isOpen={!!editingReview} onClose={() => setEditingReview(null)} title="Edit Review">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-3">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${star <= editRating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-2">Feedback</label>
            <textarea
              rows={4}
              value={editComment}
              onChange={e => setEditComment(e.target.value)}
              className="w-full p-4 rounded-2xl border border-[#d5ded8] bg-white text-base font-medium text-[#1b251f] focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-[#eaeae4]">
            <Button variant="ghost" onClick={() => setEditingReview(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
