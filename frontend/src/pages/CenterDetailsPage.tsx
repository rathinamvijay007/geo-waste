import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Navigation,
  Flag,
  ChevronLeft,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { centerApi } from '../api/centerApi';
import { reviewApi } from '../api/reviewApi';
import { adminApi } from '../api/adminApi';
import type {
  CollectionCenter,
  Review,
  RatingDistribution,
  ReportFormData,
} from '../types';
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
  const [reportType, setReportType] =
    useState<ReportFormData['type']>('wrong_address');
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
      const newReview = await reviewApi.createReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews((prev) => [newReview, ...prev]);
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
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast('success', 'Review deleted.');
    } catch {
      showToast('error', 'Failed to delete review.');
    }
  };

  const handleSubmitReport = async () => {
    if (!id || !reportDescription.trim()) return;
    setSubmittingReport(true);
    try {
      await adminApi.submitReport(id, {
        type: reportType,
        description: reportDescription,
      });
      setShowReportModal(false);
      setReportDescription('');
      showToast('success', 'Report submitted. Thank you!');
    } catch {
      showToast('error', 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading)
    return (
      <div className="pt-28 min-h-screen">
        <LoadingSpinner text="Loading center information..." size="lg" />
      </div>
    );
  if (error || !center)
    return (
      <div className="pt-28 min-h-screen">
        <ErrorState message={error || 'Center not found'} />
      </div>
    );

  const avgRating = center.rating;

  return (
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Back link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] hover:underline mb-12 group transition-colors"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#4ade80]" />
          <span>Back to Explore</span>
        </Link>

        {/* Hero Business Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 lg:mb-16 space-y-10"
        >
          {/* Banner Photo Container */}
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl bg-[#0d1611] flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 text-center p-10">
              <div className="w-20 h-20 rounded-3xl bg-[#4ade80]/10 backdrop-blur-md flex items-center justify-center mx-auto mb-5 border border-[#4ade80]/20 shadow-lg">
                <MapPin className="w-9 h-9 text-[#4ade80]" />
              </div>
              <p className="text-lg font-extrabold font-display text-[#edf7ee] tracking-wide">
                CPCB Certified Drop-off Facility
              </p>
            </div>
          </div>

          {/* Header Info */}
          <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-[#4ade80]/20 p-8 sm:p-12 lg:p-14 shadow-2xl space-y-9">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[#edf7ee] tracking-tight">
                    {center.name}
                  </h1>
                  {center.verified && <Badge variant="verified">Verified Hub</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-5 text-sm sm:text-base text-[#edf7ee]/70 font-semibold">
                  <span className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#4ade80] fill-[#4ade80] shrink-0" />
                    <span className="font-black text-[#edf7ee]">{center.rating}</span>
                    <span className="text-[#edf7ee]/40">
                      ({center.reviewCount} reviews)
                    </span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="flex items-center gap-2 text-[#edf7ee]/80">
                    <MapPin className="w-5 h-5 text-[#4ade80] shrink-0" />{' '}
                    {center.distance} km away
                  </span>
                  <span className="text-white/20">•</span>
                  <Badge variant={center.isOpen ? 'open' : 'closed'}>
                    {center.isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>
              </div>
              <FavoriteButton centerId={center.id} size="md" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/10">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="shadow-xl px-7 py-3.5"
                  leftIcon={<Navigation className="w-5 h-5" />}
                >
                  Get Directions
                </Button>
              </a>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Star className="w-5 h-5" />}
                onClick={() => setShowReviewModal(true)}
              >
                Write Review
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Flag className="w-5 h-5" />}
                onClick={() => setShowReportModal(true)}
              >
                Report Info
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Operating Hours */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-lg space-y-7 mb-10"
        >
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4ade80]" /> Weekly Schedule
          </h3>
          <div className="space-y-3">
            {center.operatingHours.map((h) => {
              const days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ];
              const isToday = h.day === days[new Date().getDay()];
              return (
                <div
                  key={h.day}
                  className={`flex items-center justify-between text-xs sm:text-sm py-3.5 px-5 rounded-2xl transition-colors ${
                    isToday
                      ? 'bg-[#4ade80]/15 border border-[#4ade80]/30 font-bold text-[#4ade80]'
                      : 'text-[#edf7ee]/70 bg-white/5 border border-white/5'
                  }`}
                >
                  <span>
                    {h.day}{' '}
                    {isToday && (
                      <span className="text-[10px] font-mono uppercase tracking-widest font-black ml-1.5 text-[#4ade80]">
                        (Today)
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-[#edf7ee]">
                    {h.isClosed ? 'Closed' : `${h.open} - ${h.close}`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Accepted Waste Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 mb-10 shadow-lg space-y-7"
        >
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80]">
            Accepted Waste Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
            {center.acceptedWaste.map((w) => (
              <div
                key={w}
                className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80]"
              >
                <CheckCircle className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span className="text-xs font-bold">{w}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About Description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#0d1611]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 mb-10 shadow-lg space-y-4"
        >
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80]">
            About This Facility
          </h3>
          <p className="text-[15px] text-[#edf7ee]/80 leading-relaxed font-normal">
            {center.description}
          </p>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <h3 className="text-2xl font-extrabold font-display text-[#edf7ee]">
              Community Reviews ({reviews.length})
            </h3>
            <Button
              size="md"
              variant="secondary"
              onClick={() => setShowReviewModal(true)}
            >
              Write Review
            </Button>
          </div>

          {/* Rating Summary Breakdown */}
          <div className="flex flex-col sm:flex-row gap-10 pb-8 border-b border-white/10 items-center">
            <div className="text-center sm:text-left shrink-0">
              <p className="text-5xl font-black font-display text-[#edf7ee] tracking-tight">
                {avgRating}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(avgRating)
                        ? 'text-[#4ade80] fill-[#4ade80]'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-[#edf7ee]/60">
                {center.reviewCount} total reviews
              </p>
            </div>
            <div className="flex-1 w-full space-y-3.5">
              {distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#edf7ee]/70 w-4">
                    {d.stars}
                  </span>
                  <Star className="w-3.5 h-3.5 text-[#4ade80] fill-[#4ade80] shrink-0" />
                  <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full bg-[#4ade80] rounded-full transition-all duration-500"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#edf7ee]/60 w-10 text-right">
                    {d.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          {reviews.length === 0 ? (
            <p className="text-sm text-[#edf7ee]/60 text-center py-10 font-normal">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-7 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#22c55e] text-[#052e16] font-extrabold text-sm flex items-center justify-center shadow-md">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#edf7ee]">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
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
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#edf7ee]/50">
                        {new Date(review.createdAt).toLocaleDateString(
                          'en-IN',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </span>
                      {review.userId === 'u-1' && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-xs font-extrabold text-rose-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[15px] text-[#edf7ee]/80 leading-relaxed font-normal">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
      >
        <div className="space-y-6 text-[#edf7ee]">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] mb-3">
              Select Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setReviewHover(s)}
                  onMouseLeave={() => setReviewHover(0)}
                  onClick={() => setReviewRating(s)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      s <= (reviewHover || reviewRating)
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
              Your Feedback
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Tell others about your experience dropping off materials at this center..."
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-sm font-normal text-[#edf7ee] placeholder:text-[#edf7ee]/40 focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80] outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              isLoading={submittingReview}
              disabled={!reviewComment.trim()}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Incorrect Information"
      >
        <div className="space-y-6 text-[#edf7ee]">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] mb-3">
              Select Issue Type
            </label>
            <div className="space-y-3">
              {reportTypes.map((rt) => (
                <label
                  key={rt.value}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === rt.value}
                    onChange={() =>
                      setReportType(rt.value as ReportFormData['type'])
                    }
                    className="w-4 h-4 border-white/20 text-[#4ade80] focus:ring-[#4ade80] cursor-pointer accent-[#22c55e]"
                  />
                  <span className="text-xs font-semibold text-[#edf7ee]/80 group-hover:text-[#4ade80]">
                    {rt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#4ade80] mb-2.5">
              Description
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={3}
              placeholder="Provide specific details about what needs to be updated..."
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-sm font-normal text-[#edf7ee] placeholder:text-[#edf7ee]/40 focus:ring-2 focus:ring-[#4ade80]/30 focus:border-[#4ade80] outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReport}
              isLoading={submittingReport}
              disabled={!reportDescription.trim()}
            >
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
