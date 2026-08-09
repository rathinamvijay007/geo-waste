import type { Favorite } from '../types';
import { mockCenters } from './centers';

export const mockFavorites: Favorite[] = [
  {
    id: 'fav-1',
    userId: 'u-1',
    centerId: 'c-1',
    center: mockCenters[0],
    createdAt: '2025-06-15T10:30:00Z',
  },
  {
    id: 'fav-2',
    userId: 'u-1',
    centerId: 'c-6',
    center: mockCenters[5],
    createdAt: '2025-06-20T09:30:00Z',
  },
  {
    id: 'fav-3',
    userId: 'u-1',
    centerId: 'c-10',
    center: mockCenters[9],
    createdAt: '2025-06-25T08:45:00Z',
  },
  {
    id: 'fav-4',
    userId: 'u-1',
    centerId: 'c-4',
    center: mockCenters[3],
    createdAt: '2025-05-28T15:45:00Z',
  },
  {
    id: 'fav-5',
    userId: 'u-1',
    centerId: 'c-2',
    center: mockCenters[1],
    createdAt: '2025-05-15T16:20:00Z',
  },
];
