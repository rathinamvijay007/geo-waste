import apiClient from './client';
import type { User } from '../types';
import { mapUserResponseToUser } from './authApi';

export interface EcoCategoryStats {
  waste_type: string;
  quantity_kg: number;
  co2_saved_kg: number;
  energy_saved_kwh: number;
}

export interface EcoStatsResponse {
  total_recycled_kg: number;
  total_co2_saved_kg: number;
  total_energy_saved_kwh: number;
  activity_count: number;
  by_category: EcoCategoryStats[];
}

export interface RecentCenterResponse {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  viewed_at: string;
}

export interface SearchHistoryResponse {
  id: number;
  query: string;
  search_type: string;
  created_at: string;
}

export const userApi = {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get('/auth/me');
    return mapUserResponseToUser(data);
  },

  async updateProfile(updates: { name?: string; phone?: string }): Promise<User> {
    const { data } = await apiClient.put('/users/me', updates);
    return mapUserResponseToUser(data);
  },

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    // Password update endpoint placeholder for profile page compatibility
    await new Promise((resolve) => setTimeout(resolve, 400));
  },

  async getEcoStats(): Promise<EcoStatsResponse> {
    const { data } = await apiClient.get<EcoStatsResponse>('/users/me/eco-stats');
    return data;
  },

  async getRecentCenters(): Promise<RecentCenterResponse[]> {
    const { data } = await apiClient.get<RecentCenterResponse[]>('/users/me/recent-centers');
    return data;
  },

  async getSearchHistory(): Promise<SearchHistoryResponse[]> {
    const { data } = await apiClient.get<SearchHistoryResponse[]>('/users/me/search-history');
    return data;
  },

  async clearSearchHistory(): Promise<{ message: string; deleted_count: number }> {
    const { data } = await apiClient.delete<{ message: string; deleted_count: number }>('/users/me/search-history');
    return data;
  },
};
