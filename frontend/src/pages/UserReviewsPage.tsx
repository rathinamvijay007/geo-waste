import { useState, useEffect } from 'react';
import { MessageSquare, Star, Edit2, Trash2, Sparkles } from 'lucide-react';
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
    reviewApi
      .getUserReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewApi.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
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
      await reviewApi.updateReview(editingReview.id, {
        rating: editRating,
        comment: editComment,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: editRating, comment: editComment }
            : r
        )
      );
      setEditingReview(null);
      showToast('success', 'Review updated.');
    } catch {
      showToast('error', 'Failed to update review.');
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-6 mb-16 lg:mb-20 pb-10 border-b border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-[#4ade80]/10 border border-[#4ade80]/30 flex items-center justify-center shrink-0 shadow-lg">
            <MessageSquare className="w-8 h-8 text-[#4ade80]" />
          </div>
          <div>
            <div className="eyebrow mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>COMMUNITY FEEDBACK</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#edf7ee]">
              My <span className="gradient-text">Reviews</span>
            </h1>
            <p className="text-sm font-medium text-[#edf7ee]/60 mt-1">
              {reviews.length} reviews published
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#0d1611]/80 rounded-3xl p-8 border border-white/10 space-y-4"
              >
                <div className="h-6 w-1/3 bg-white/10 rounded-lg" />
                <div className="h-4 w-full bg-white/5 rounded-lg" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12 text-[#4ade80]" />}
            title="No reviews posted yet"
            description="Visit a drop-off center and leave a review to help the community discover verified facilities."
            actionLabel="Find Centers to Review"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <div className="space-y-5">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-7 sm:p-9 shadow-lg space-y-5 hover:border-[#4ade80]/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-extrabold font-display text-xl text-[#edf7ee]">
                    {review.centerName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(review)}
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#edf7ee]/80 hover:text-white transition-all border border-white/10 cursor-pointer shadow-sm"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white transition-all cursor-pointer shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-[#4ade80] fill-[#4ade80]'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#edf7ee]/50 font-semibold ml-2">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-[15px] text-[#edf7ee]/80 leading-relaxed font-normal">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      <Modal
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        title="Edit Review"
      >
        <div className="space-y-6 text-[#edf7ee]">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setEditRating(s)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= editRating
                        ? 'text-[#4ade80] fill-[#4ade80]'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] mb-2.5">
              Comment
            </label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-sm font-normal text-[#edf7ee] focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80] outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setEditingReview(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
