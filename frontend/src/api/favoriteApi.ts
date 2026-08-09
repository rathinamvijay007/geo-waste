import apiClient from './client';
import type { Favorite, CollectionCenter } from '../types';
import { mapCenterResponseToCenter } from './centerApi';

export const favoriteApi = {
  async getFavoriteCenters(): Promise<CollectionCenter[]> {
    const { data } = await apiClient.get<any[]>('/favorites');
    return data.map((c) => mapCenterResponseToCenter(c));
  },

  async getFavorites(): Promise<Favorite[]> {
    const centers = await this.getFavoriteCenters();
    return centers.map((center) => ({
      id: `fav-${center.id}`,
      userId: 'user',
      centerId: center.id,
      center,
      createdAt: new Date().toISOString(),
    }));
  },

  async addFavorite(centerId: string): Promise<any> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;
    const { data } = await apiClient.post(`/favorites/${validId}`);
    return data;
  },

  async removeFavorite(centerId: string): Promise<void> {
    const numericId = parseInt(centerId, 10);
    const validId = isNaN(numericId) ? 1 : numericId;
    await apiClient.delete(`/favorites/${validId}`);
  },
};
