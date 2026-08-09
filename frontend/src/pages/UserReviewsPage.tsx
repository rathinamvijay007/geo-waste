import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Trash2, Edit3, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { reviewApi } from '../api/reviewApi';
import type { Review } from '../types';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { showToast } from '../components/common/Toast';

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<(Review & { centerName?: string; centerId?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load reviews for centers
    reviewApi.getReviewsByCenter('c-1')
      .then(res => setReviews(res.reviews.map(r => ({ ...r, centerName: 'Coimbatore E-Waste Hub', centerId: 'c-1' }))))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await reviewApi.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('success', 'Review deleted successfully.');
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
    if (!editingReview || !editComment.trim()) return;
    setSaving(true);
    try {
      await reviewApi.updateReview(editingReview.id, { rating: editRating, comment: editComment });
      setReviews(prev => prev.map(r => r.id === editingReview.id ? { ...r, rating: editRating, comment: editComment } : r));
      setEditingReview(null);
      showToast('success', 'Review updated.');
    } catch {
      showToast('error', 'Failed to update review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-surface-200/80">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">My Reviews</h1>
            <p className="text-sm font-medium text-surface-500 mt-1">Manage and edit your feedback for drop-off centers</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 border border-surface-200/80 h-32" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-10 h-10 text-surface-400" />}
            title="No reviews submitted yet"
            description="Visit a drop-off center and leave a review to help others in your community."
            actionLabel="Find Centers to Review"
            onAction={() => window.location.href = '/explore'}
          />
        ) : (
          <div className="space-y-5">
            {reviews.map((rev, i) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-7 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-100">
                  <div>
                    <Link to={`/center/${rev.centerId || 'c-1'}`} className="font-bold text-lg text-surface-900 hover:text-eco-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-eco-700 shrink-0" />
                      <span>{rev.centerName || 'Collection Center'}</span>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-surface-400">
                        • {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="md" leftIcon={<Edit3 className="w-4 h-4" />} onClick={() => handleOpenEdit(rev)}>
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors cursor-pointer border border-transparent hover:border-red-200"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-surface-700 leading-relaxed font-normal">{rev.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      <Modal isOpen={!!editingReview} onClose={() => setEditingReview(null)} title="Edit Your Review" size="md">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setEditRating(s)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${s <= editRating ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 mb-2">Review Comment</label>
            <textarea
              value={editComment}
              onChange={e => setEditComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-surface-200 text-sm text-surface-900 focus:ring-2 focus:ring-eco-600/20 focus:border-eco-600 outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} isLoading={saving} disabled={!editComment.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
