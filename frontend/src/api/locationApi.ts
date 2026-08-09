import apiClient from './client';
import type { UserLocation } from '../types';

export const locationApi = {
  async postLocation(latitude: number, longitude: number): Promise<{ latitude: number; longitude: number }> {
    const { data } = await apiClient.post('/location', { latitude, longitude });
    return data;
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<UserLocation> {
    try {
      const { data } = await apiClient.get<{ address: string }>('/location/address', {
        params: { latitude, longitude },
      });
      return {
        latitude,
        longitude,
        address: data.address,
        city: 'Coimbatore',
        state: 'Tamil Nadu',
      };
    } catch {
      return {
        latitude,
        longitude,
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: 'Coimbatore',
        state: 'Tamil Nadu',
      };
    }
  },

  detectUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      });
    });
  },
};
