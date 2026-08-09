import apiClient from './client';
import type { Review, ReviewFormData, RatingDistribution } from '../types';

function computeDistribution(reviews: Review[]): RatingDistribution[] {
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
}

export function mapReviewResponseToReview(raw: any, userName?: string): Review {
  return {
    id: String(raw.id),
    userId: String(raw.user_id),
    userName: userName || `User #${raw.user_id}`,
    centerId: String(raw.center_id),
    rating: raw.rating,
    comment: raw.comment || '',
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at,
    status: 'active',
  };
}

export const reviewApi = {
  async getReviewsByCenter(centerId: string): Promise<{ reviews: Review[]; distribution: RatingDistribution[] }> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;

    const { data } = await apiClient.get<any[]>(`/centers/${validId}/reviews`);
    const reviews = data.map((r) => mapReviewResponseToReview(r));
    return { reviews, distribution: computeDistribution(reviews) };
  },

  async createReview(centerId: string, review: ReviewFormData): Promise<Review> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;

    const { data } = await apiClient.post<any>(`/centers/${validId}/reviews`, {
      rating: review.rating,
      comment: review.comment || undefined,
    });
    return mapReviewResponseToReview(data);
  },

  async updateReview(reviewId: string, review: ReviewFormData): Promise<Review> {
    const numericId = parseInt(reviewId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;

    const { data } = await apiClient.put<any>(`/reviews/${validId}`, {
      rating: review.rating,
      comment: review.comment || undefined,
    });
    return mapReviewResponseToReview(data);
  },

  async deleteReview(reviewId: string): Promise<void> {
    const numericId = parseInt(reviewId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;

    await apiClient.delete(`/reviews/${validId}`);
  },
};
