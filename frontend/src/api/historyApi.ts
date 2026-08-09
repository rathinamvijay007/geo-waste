import type { SearchHistoryItem } from '../types';
import { userApi } from './userApi';

export const historyApi = {
  async getHistory(): Promise<SearchHistoryItem[]> {
    try {
      const items = await userApi.getSearchHistory();
      return items.map((item) => ({
        id: String(item.id),
        query: item.query,
        wasteType: item.search_type || 'General',
        location: 'Coimbatore',
        date: new Date(item.created_at).toLocaleDateString(),
      }));
    } catch {
      return [];
    }
  },

  async deleteHistoryItem(_id: string): Promise<void> {
    await userApi.clearSearchHistory();
  },

  async clearHistory(): Promise<void> {
    await userApi.clearSearchHistory();
  },
};
