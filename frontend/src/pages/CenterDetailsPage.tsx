import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, Phone, Clock, Navigation, Flag, ChevronLeft,
  CheckCircle, Mail
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

  if (loading) return <div className="pt-28"><LoadingSpinner text="Loading center details..." size="lg" /></div>;
  if (error || !center) return <div className="pt-28"><ErrorState message={error || 'Center not found.'} /></div>;

  const avgRating = center.rating;

  return (
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Back link */}
        <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-surface-500 hover:text-eco-800 mb-8 group transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore</span>
        </Link>

        {/* Hero Business Header Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          {/* Banner Photo Placeholder */}
          <div className="w-full h-56 sm:h-72 rounded-3xl bg-gradient-to-br from-eco-950 via-eco-900 to-eco-950 flex items-center justify-center mb-8 border border-eco-900/10 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/15">
                <MapPin className="w-8 h-8 text-eco-300" />
              </div>
              <p className="text-base font-semibold text-white tracking-wide">CPCB Certified Drop-off Facility</p>
            </div>
          </div>

          {/* Header Info */}
          <div className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-surface-900 tracking-tight">{center.name}</h1>
                  {center.verified && <Badge variant="verified">Verified</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="font-bold text-surface-800">{center.rating}</span>
                    <span className="text-surface-400">({center.reviewCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-surface-600">
                    <MapPin className="w-4 h-4 text-surface-400 shrink-0" /> {center.distance} km away
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
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-surface-100">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" leftIcon={<Navigation className="w-4 h-4" />}>
                  Get Directions
                </Button>
              </a>
              <Button variant="secondary" size="lg" leftIcon={<Star className="w-4 h-4" />} onClick={() => setShowReviewModal(true)}>
                Write Review
              </Button>
              <Button variant="outline" size="lg" leftIcon={<Flag className="w-4 h-4" />} onClick={() => setShowReportModal(true)}>
                Report Information
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-8 mb-10">
          {/* Contact Details */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-8 space-y-5 shadow-2xs"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700">Contact & Address</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-eco-700 mt-0.5 shrink-0" />
                <span className="text-surface-700 leading-relaxed font-normal">{center.address}, {center.city}, {center.state}</span>
              </div>
              <div className="flex items-center gap-3.5">
                <Phone className="w-5 h-5 text-eco-700 shrink-0" />
                <span className="text-surface-800 font-semibold">{center.phone}</span>
              </div>
              {center.email && (
                <div className="flex items-center gap-3.5">
                  <Mail className="w-5 h-5 text-eco-700 shrink-0" />
                  <span className="text-surface-700">{center.email}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Operating Hours — Well-Separated */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-8 shadow-2xs space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-eco-700" /> Weekly Schedule
            </h3>
            <div className="space-y-2">
              {center.operatingHours.map(h => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const isToday = h.day === days[new Date().getDay()];
                return (
                  <div key={h.day} className={`flex items-center justify-between text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-colors ${isToday ? 'bg-eco-50 border border-eco-200/80 font-bold text-eco-950' : 'text-surface-600'}`}>
                    <span>{h.day} {isToday && <span className="text-[10px] uppercase tracking-wider font-extrabold ml-1.5 text-eco-700">(Today)</span>}</span>
                    <span className="font-medium">{h.isClosed ? 'Closed' : `${h.open} - ${h.close}`}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Accepted Waste Grid — Feature #15 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-9 mb-10 shadow-2xs space-y-5"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700">Accepted Waste Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {center.acceptedWaste.map(w => (
              <div key={w} className="flex items-center gap-3 p-4 rounded-2xl bg-eco-50/60 border border-eco-200/60 text-eco-950">
                <CheckCircle className="w-4 h-4 text-eco-700 shrink-0" />
                <span className="text-sm font-semibold">{w}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About Description */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-9 mb-10 shadow-2xs space-y-3"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700">About This Facility</h3>
          <p className="text-base text-surface-600 leading-relaxed font-normal">{center.description}</p>
        </motion.div>

        {/* Reviews Section — Readable Review Cards */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-2xs space-y-8"
        >
          <div className="flex items-center justify-between pb-5 border-b border-surface-100">
            <h3 className="text-xl font-bold text-surface-900">Community Reviews ({reviews.length})</h3>
            <Button size="md" variant="secondary" onClick={() => setShowReviewModal(true)}>
              Write Review
            </Button>
          </div>

          {/* Rating Summary Breakdown */}
          <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-surface-100 items-center">
            <div className="text-center sm:text-left shrink-0">
              <p className="text-5xl font-extrabold text-surface-900 tracking-tight">{avgRating}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                ))}
              </div>
              <p className="text-xs font-semibold text-surface-500">{center.reviewCount} total reviews</p>
            </div>
            <div className="flex-1 w-full space-y-2.5">
              {distribution.map(d => (
                <div key={d.stars} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-surface-600 w-4">{d.stars}</span>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <div className="flex-1 h-2.5 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${d.percentage}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-surface-500 w-10 text-right">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List — Readable & Separated Cards */}
          {reviews.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-10">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-5">
              {reviews.map(review => (
                <div key={review.id} className="p-6 bg-surface-50/70 rounded-2xl border border-surface-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-eco-100 text-eco-900 font-bold text-sm flex items-center justify-center border border-eco-200">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-surface-900">{review.userName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-surface-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {review.userId === 'u-1' && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-surface-700 leading-relaxed font-normal">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Write Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review" size="md">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 mb-3">Select Your Rating</label>
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
                      : 'text-surface-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 mb-2">Your Feedback</label>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Tell others about your experience dropping off materials at this center..."
              className="w-full px-4 py-3 rounded-2xl border border-surface-200 text-sm text-surface-900 focus:ring-2 focus:ring-eco-600/20 focus:border-eco-600 outline-none resize-none"
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
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Incorrect Information" size="md">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 mb-3">Select Issue Type</label>
            <div className="space-y-3">
              {reportTypes.map(rt => (
                <label key={rt.value} className="flex items-center gap-3 cursor-pointer group py-1">
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === rt.value}
                    onChange={() => setReportType(rt.value as ReportFormData['type'])}
                    className="w-4 h-4 border-surface-300 text-eco-700 focus:ring-eco-600 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-surface-700 group-hover:text-surface-900">{rt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 mb-2">Description</label>
            <textarea
              value={reportDescription}
              onChange={e => setReportDescription(e.target.value)}
              rows={3}
              placeholder="Provide specific details about what needs to be updated..."
              className="w-full px-4 py-3 rounded-2xl border border-surface-200 text-sm text-surface-900 focus:ring-2 focus:ring-eco-600/20 focus:border-eco-600 outline-none resize-none"
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
