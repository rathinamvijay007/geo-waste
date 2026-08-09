import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, Clock, Navigation, Flag, ChevronLeft,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { centerApi } from '../api/centerApi';
import { reviewApi } from '../api/reviewApi';
import { adminApi } from '../api/adminApi';
import type { CollectionCenter, Review, RatingDistribution, ReportFormData } from '../types';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FavoriteButton from '../components/favorites/FavoriteButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { showToast } from '../components/common/Toast';

const reportTypes = [
  { value: 'wrong_address', label: 'Wrong address' },
  { value: 'wrong_hours', label: 'Wrong opening hours' },
  { value: 'center_closed', label: 'Center closed permanently' },
  { value: 'wrong_waste_types', label: 'Wrong waste types listed' },
  { value: 'incorrect_phone', label: 'Incorrect phone number' },
  { value: 'other', label: 'Other' },
] as const;

export default function CenterDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [center, setCenter] = useState<CollectionCenter | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [distribution, setDistribution] = useState<RatingDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewHover, setReviewHover] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<ReportFormData['type']>('wrong_address');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      centerApi.getCenterById(id),
      reviewApi.getReviewsByCenter(id),
    ])
      .then(([centerData, reviewData]) => {
        setCenter(centerData);
        setReviews(reviewData.reviews);
        setDistribution(reviewData.distribution);
      })
      .catch(() => setError('Unable to load center details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const newReview = await reviewApi.createReview(id, { rating: reviewRating, comment: reviewComment });
      setReviews(prev => [newReview, ...prev]);
      setShowReviewModal(false);
      setReviewComment('');
      setReviewRating(5);
      showToast('success', 'Review submitted successfully!');
    } catch {
      showToast('error', 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewApi.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      showToast('success', 'Review deleted.');
    } catch {
      showToast('error', 'Failed to delete review.');
    }
  };

  const handleSubmitReport = async () => {
    if (!id || !reportDescription.trim()) return;
    setSubmittingReport(true);
    try {
      await adminApi.submitReport(id, { type: reportType, description: reportDescription });
      setShowReportModal(false);
      setReportDescription('');
      showToast('success', 'Report submitted. Thank you!');
    } catch {
      showToast('error', 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) return <div className="pt-28"><LoadingSpinner text="Loading center information..." size="lg" /></div>;
  if (error || !center) return <div className="pt-28"><ErrorState message={error || 'Center not found'} /></div>;

  const avgRating = center.rating;

  return (
    <div className="py-20 sm:py-28 lg:py-36 min-h-screen bg-ambient-light">
      <div className="max-w-5xl lg:max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Back link */}
        <Link to="/explore" className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#143e2b] hover:underline mb-10 group transition-colors">
          <ChevronLeft className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform text-[#22c55e]" />
          <span>Back to Explore</span>
        </Link>

        {/* Hero Business Header Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-14 space-y-10">
          {/* Banner Photo Placeholder */}
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl bg-ambient-dark flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#22c55e]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 text-center p-10">
              <div className="w-22 h-22 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-5 border border-white/15 shadow-md">
                <MapPin className="w-10 h-10 text-[#4ade80]" />
              </div>
              <p className="text-lg font-extrabold font-display text-white tracking-wide">CPCB Certified Drop-off Facility</p>
            </div>
          </div>

          {/* Header Info */}
          <div className="glass-panel rounded-3xl border border-white/80 p-10 sm:p-14 lg:p-16 shadow-2xl space-y-9">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl sm:text-5xl font-black font-display text-[#1b251f] tracking-tight">{center.name}</h1>
                  {center.verified && <Badge variant="verified">Verified Hub</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-5 text-base text-[#556358] font-semibold">
                  <span className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#143e2b] fill-[#143e2b] shrink-0" />
                    <span className="font-black text-[#1b251f]">{center.rating}</span>
                    <span className="text-[#788a7e]">({center.reviewCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2 text-[#4a554e]">
                    <MapPin className="w-5 h-5 text-[#788a7e] shrink-0" /> {center.distance} km away
                  </span>
                  <span>•</span>
                  <Badge variant={center.isOpen ? 'open' : 'closed'}>
                    {center.isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>
              </div>
              <FavoriteButton centerId={center.id} size="md" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-8 border-t border-[#eaeae4]">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="shadow-lg shadow-[#143e2b]/25" leftIcon={<Navigation className="w-5 h-5" />}>
                  Get Directions
                </Button>
              </a>
              <Button variant="secondary" size="lg" leftIcon={<Star className="w-5 h-5" />} onClick={() => setShowReviewModal(true)}>
                Write Review
              </Button>
              <Button variant="outline" size="lg" leftIcon={<Flag className="w-5 h-5" />} onClick={() => setShowReportModal(true)}>
                Report Information
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Operating Hours */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl border border-white/80 p-8 sm:p-10 shadow-md space-y-6 mb-10"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#22c55e]" /> Weekly Schedule
          </h3>
          <div className="space-y-2">
            {center.operatingHours.map(h => {
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const isToday = h.day === days[new Date().getDay()];
              return (
                <div key={h.day} className={`flex items-center justify-between text-xs sm:text-sm py-2 px-4 rounded-xl transition-colors ${isToday ? 'bg-[#ebf5ed] border border-[#22c55e]/30 font-bold text-[#143e2b]' : 'text-[#4a554e]'}`}>
                  <span>{h.day} {isToday && <span className="text-[10px] uppercase tracking-widest font-black ml-1.5 text-[#22c55e]">(Today)</span>}</span>
                  <span className="font-bold">{h.isClosed ? 'Closed' : `${h.open} - ${h.close}`}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Accepted Waste Grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl border border-white/80 p-8 sm:p-10 mb-10 shadow-md space-y-6"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b]">Accepted Waste Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {center.acceptedWaste.map(w => (
              <div key={w} className="flex items-center gap-3 p-4 rounded-2xl bg-[#ebf5ed]/80 border border-[#22c55e]/30 text-[#143e2b]">
                <CheckCircle className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span className="text-xs font-bold">{w}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About Description */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card rounded-3xl border border-white/80 p-8 sm:p-10 mb-10 shadow-md space-y-3"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b]">About This Facility</h3>
          <p className="text-sm text-[#4a554e] leading-relaxed font-medium">{center.description}</p>
        </motion.div>

        {/* Reviews Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-3xl border border-white/80 p-8 sm:p-10 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between pb-5 border-b border-[#eaeae4]">
            <h3 className="text-2xl font-extrabold font-display text-[#1b251f]">Community Reviews ({reviews.length})</h3>
            <Button size="md" variant="secondary" onClick={() => setShowReviewModal(true)}>
              Write Review
            </Button>
          </div>

          {/* Rating Summary Breakdown */}
          <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-[#eaeae4] items-center">
            <div className="text-center sm:text-left shrink-0">
              <p className="text-5xl font-black font-display text-[#1b251f] tracking-tight">{avgRating}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`} />
                ))}
              </div>
              <p className="text-xs font-bold text-[#556358]">{center.reviewCount} total reviews</p>
            </div>
            <div className="flex-1 w-full space-y-2.5">
              {distribution.map(d => (
                <div key={d.stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#4a554e] w-4">{d.stars}</span>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-[#eaeae4]">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${d.percentage}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#556358] w-10 text-right">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          {reviews.length === 0 ? (
            <p className="text-sm text-[#556358] text-center py-10 font-medium">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-5">
              {reviews.map(review => (
                <div key={review.id} className="p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-[#eaeae4] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#143e2b] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1b251f]">{review.userName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#788a7e]">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {review.userId === 'u-1' && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#4a554e] leading-relaxed font-medium">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Write Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-3">Select Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onMouseEnter={() => setReviewHover(s)}
                  onMouseLeave={() => setReviewHover(0)}
                  onClick={() => setReviewRating(s)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 transition-colors ${
                    s <= (reviewHover || reviewRating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-2">Your Feedback</label>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Tell others about your experience dropping off materials at this center..."
              className="w-full px-4.5 py-3.5 rounded-2xl border border-[#d5ded8] bg-white text-sm font-medium text-[#1b251f] focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview} isLoading={submittingReview} disabled={!reviewComment.trim()}>
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Incorrect Information">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-3">Select Issue Type</label>
            <div className="space-y-3">
              {reportTypes.map(rt => (
                <label key={rt.value} className="flex items-center gap-3 cursor-pointer group py-1">
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === rt.value}
                    onChange={() => setReportType(rt.value as ReportFormData['type'])}
                    className="w-4 h-4 border-[#d5ded8] text-[#143e2b] focus:ring-[#22c55e] cursor-pointer accent-[#143e2b]"
                  />
                  <span className="text-xs font-bold text-[#1b251f] group-hover:text-[#143e2b]">{rt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#143e2b] mb-2">Description</label>
            <textarea
              value={reportDescription}
              onChange={e => setReportDescription(e.target.value)}
              rows={3}
              placeholder="Provide specific details about what needs to be updated..."
              className="w-full px-4.5 py-3.5 rounded-2xl border border-[#d5ded8] bg-white text-sm font-medium text-[#1b251f] focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowReportModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitReport} isLoading={submittingReport} disabled={!reportDescription.trim()}>
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
