import apiClient from './client';
import type { CollectionCenter, ExploreFilters } from '../types';

export function mapCenterResponseToCenter(
  raw: any,
  extra?: {
    wasteTypes?: string[];
    hours?: any[];
    availability?: boolean;
  }
): CollectionCenter {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const operatingHours = extra?.hours && extra.hours.length > 0
    ? extra.hours.map((h: any) => ({
        day: daysOfWeek[h.day_of_week] || 'Day',
        open: h.open_time ? String(h.open_time).substring(0, 5) : '09:00',
        close: h.close_time ? String(h.close_time).substring(0, 5) : '18:00',
        isClosed: false,
      }))
    : [
        { day: 'Monday - Saturday', open: '09:00', close: '18:00', isClosed: false },
        { day: 'Sunday', open: 'Closed', close: 'Closed', isClosed: true },
      ];

  const acceptedWaste = extra?.wasteTypes && extra.wasteTypes.length > 0
    ? extra.wasteTypes
    : (raw.acceptedWaste || ['E-Waste', 'Battery', 'Plastic', 'Paper']);

  const rating = typeof raw.average_rating === 'number' && raw.average_rating > 0
    ? raw.average_rating
    : (raw.rating || 4.5);

  const reviewCount = typeof raw.review_count === 'number'
    ? raw.review_count
    : (raw.reviewCount || 12);

  const distance = typeof raw.distance_km === 'number' ? raw.distance_km : raw.distance;

  return {
    id: String(raw.id),
    name: raw.name || '',
    description: raw.description || 'EcoDrop collection center',
    address: raw.address || '',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    phone: raw.phone || '+91 98765 43210',
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude),
    rating,
    reviewCount,
    verified: Boolean(raw.verified),
    acceptedWaste,
    operatingHours,
    images: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    ],
    distance,
    isOpen: extra?.availability !== undefined ? extra.availability : true,
    createdAt: raw.created_at || new Date().toISOString(),
    status: 'active',
  };
}

export const centerApi = {
  async getCenters(filters?: Partial<ExploreFilters>): Promise<CollectionCenter[]> {
    let rawCenters: any[] = [];

    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const { data } = await apiClient.get<any[]>('/centers/search', {
        params: { q: filters.searchQuery.trim() },
      });
      rawCenters = data;
    } else if (filters?.verifiedOnly) {
      const { data } = await apiClient.get<any[]>('/centers/verified');
      rawCenters = data;
    } else {
      const { data } = await apiClient.get<any[]>('/centers');
      rawCenters = data;
    }

    let centers = rawCenters.map((c) => mapCenterResponseToCenter(c));

    if (filters?.wasteType && filters.wasteType !== 'All') {
      const wasteType = filters.wasteType;
      centers = centers.filter((c) => c.acceptedWaste.includes(wasteType));
    }
    if (filters?.distance && filters.distance > 0) {
      const maxDistance = filters.distance;
      centers = centers.filter((c) => (c.distance || 0) <= maxDistance);
    }
    if (filters?.rating && filters.rating > 0) {
      const minRating = filters.rating;
      centers = centers.filter((c) => c.rating >= minRating);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'nearest':
          centers.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case 'highest_rated':
          centers.sort((a, b) => b.rating - a.rating);
          break;
        case 'most_popular':
          centers.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    return centers;
  },

  async getCenterById(id: string): Promise<CollectionCenter> {
    const numericId = parseInt(id, 10);
    const centerId = isNaN(numericId) ? 1 : numericId;

    const [centerRes, wasteTypesRes, hoursRes, availabilityRes] = await Promise.allSettled([
      apiClient.get<any>(`/centers/${centerId}`),
      apiClient.get<any[]>(`/centers/${centerId}/waste-types`),
      apiClient.get<any[]>(`/centers/${centerId}/hours`),
      apiClient.get<any>(`/centers/${centerId}/availability`),
    ]);

    if (centerRes.status === 'rejected') {
      throw new Error('Collection center not found');
    }

    const rawCenter = centerRes.value.data;
    const wasteTypes = wasteTypesRes.status === 'fulfilled'
      ? wasteTypesRes.value.data.map((w: any) => w.name)
      : undefined;
    const hours = hoursRes.status === 'fulfilled' ? hoursRes.value.data : undefined;
    const availability = availabilityRes.status === 'fulfilled'
      ? availabilityRes.value.data.is_open
      : undefined;

    return mapCenterResponseToCenter(rawCenter, { wasteTypes, hours, availability });
  },

  async searchCenters(query: string): Promise<CollectionCenter[]> {
    if (!query.trim()) return [];
    const { data } = await apiClient.get<any[]>('/centers/search', {
      params: { q: query.trim() },
    });
    return data.map((c) => mapCenterResponseToCenter(c));
  },

  async getNearbyCenters(
    latitude: number,
    longitude: number,
    radiusKm?: number,
    wasteType?: string,
    sort?: 'rating' | 'distance'
  ): Promise<CollectionCenter[]> {
    const params: any = { latitude, longitude };
    if (radiusKm) params.radius = radiusKm;
    if (wasteType && wasteType !== 'All') params.waste_type = wasteType;
    if (sort) params.sort = sort;

    const { data } = await apiClient.get<any[]>('/centers/nearby', { params });
    return data.map((c) => mapCenterResponseToCenter(c));
  },

  async getPopularCenters(): Promise<CollectionCenter[]> {
    const { data } = await apiClient.get<any[]>('/centers/popular');
    return data.map((c) => mapCenterResponseToCenter(c));
  },

  async getVerifiedCenters(): Promise<CollectionCenter[]> {
    const { data } = await apiClient.get<any[]>('/centers/verified');
    return data.map((c) => mapCenterResponseToCenter(c));
  },
};
