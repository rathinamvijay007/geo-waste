import apiClient from './client';
import type { CollectionCenter, User, Review, Report, AnalyticsData, AdminStats } from '../types';
import { mapCenterResponseToCenter } from './centerApi';
import { mockUsers } from '../mock/users';
import { mockReviews } from '../mock/reviews';
import { mockAnalytics, mockAdminStats, mockReports } from '../mock/analytics';

export const adminApi = {
  // Admin Center CRUD
  async getAllCenters(): Promise<CollectionCenter[]> {
    const { data } = await apiClient.get<any[]>('/centers');
    return data.map((c) => mapCenterResponseToCenter(c));
  },

  async createCenter(centerData: {
    name: string;
    description?: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    verified?: boolean;
  }): Promise<CollectionCenter> {
    const { data } = await apiClient.post<any>('/admin/centers', {
      name: centerData.name,
      description: centerData.description || undefined,
      address: centerData.address,
      latitude: Number(centerData.latitude),
      longitude: Number(centerData.longitude),
      phone: centerData.phone || undefined,
      verified: Boolean(centerData.verified),
    });
    return mapCenterResponseToCenter(data);
  },

  async updateCenter(
    centerId: string,
    updates: Partial<{
      name: string;
      description: string;
      address: string;
      latitude: number;
      longitude: number;
      phone: string;
      verified: boolean;
    }>
  ): Promise<CollectionCenter> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;

    const { data } = await apiClient.put<any>(`/admin/centers/${validId}`, updates);
    return mapCenterResponseToCenter(data);
  },

  async verifyCenter(centerId: string): Promise<CollectionCenter> {
    return this.updateCenter(centerId, { verified: true });
  },

  async unverifyCenter(centerId: string): Promise<CollectionCenter> {
    return this.updateCenter(centerId, { verified: false });
  },

  async deleteCenter(centerId: string): Promise<void> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;
    await apiClient.delete(`/admin/centers/${validId}`);
  },

  // Submit Report endpoint
  async submitReport(
    centerId: string,
    reportData: { type: string; description: string }
  ): Promise<Report> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;

    const { data } = await apiClient.post<any>(`/centers/${validId}/report`, {
      reason: reportData.type || 'Inaccurate information',
      description: reportData.description || undefined,
    });

    return {
      id: String(data.id),
      centerId: String(data.center_id),
      centerName: `Center #${data.center_id}`,
      userId: String(data.user_id),
      userName: `User #${data.user_id}`,
      type: (reportData.type as Report['type']) || 'other',
      description: data.description || '',
      status: data.status === 'pending' ? 'pending' : 'resolved',
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  // Auxiliary Stats & Analytics (Admin Dashboard)
  async getStats(): Promise<AdminStats> {
    try {
      const centers = await this.getAllCenters();
      const verified = centers.filter((c) => c.verified).length;
      return {
        totalUsers: 14,
        totalCenters: centers.length,
        verifiedCenters: verified,
        pendingVerification: centers.length - verified,
        totalReviews: 28,
        totalReports: 3,
        pendingReports: 1,
      };
    } catch {
      return mockAdminStats;
    }
  },

  async getAnalytics(): Promise<AnalyticsData> {
    return mockAnalytics;
  },

  async getAllUsers(): Promise<User[]> {
    return mockUsers;
  },

  async deactivateUser(userId: string): Promise<User> {
    const user = mockUsers.find((u) => u.id === userId);
    return { ...(user || mockUsers[0]), status: 'inactive' };
  },

  async getAllReviews(): Promise<Review[]> {
    return mockReviews;
  },

  async removeReview(reviewId: string): Promise<void> {
    const numericId = parseInt(reviewId, 10);
    if (!isNaN(numericId)) {
      await apiClient.delete(`/reviews/${numericId}`);
    }
  },

  async flagReview(reviewId: string): Promise<Review> {
    const review = mockReviews.find((r) => r.id === reviewId);
    return { ...(review || mockReviews[0]), status: 'flagged' };
  },

  async getAllReports(): Promise<Report[]> {
    return mockReports;
  },

  async resolveReport(reportId: string): Promise<Report> {
    const report = mockReports.find((r) => r.id === reportId);
    return { ...(report || mockReports[0]), status: 'resolved', resolvedAt: new Date().toISOString() };
  },

  async rejectReport(reportId: string): Promise<Report> {
    const report = mockReports.find((r) => r.id === reportId);
    return { ...(report || mockReports[0]), status: 'rejected', resolvedAt: new Date().toISOString() };
  },
};
