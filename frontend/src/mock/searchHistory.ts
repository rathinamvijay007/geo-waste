import type { SearchHistoryItem } from '../types';

export const mockSearchHistory: SearchHistoryItem[] = [
  { id: 'sh-1', query: 'Battery recycling', wasteType: 'Battery', location: 'Coimbatore', date: '2025-07-09T10:30:00Z' },
  { id: 'sh-2', query: 'E-Waste disposal', wasteType: 'E-Waste', location: 'Gandhipuram', date: '2025-07-08T14:15:00Z' },
  { id: 'sh-3', query: 'Plastic collection', wasteType: 'Plastic', location: 'RS Puram', date: '2025-07-07T09:00:00Z' },
  { id: 'sh-4', query: 'Electronics recycler', wasteType: 'Electronics', location: 'Peelamedu', date: '2025-07-05T16:45:00Z' },
  { id: 'sh-5', query: 'Green Earth Recycling', wasteType: 'E-Waste', location: 'Avinashi Road', date: '2025-07-03T11:20:00Z' },
  { id: 'sh-6', query: 'Battery disposal near me', wasteType: 'Battery', location: 'Saravanampatti', date: '2025-07-01T08:30:00Z' },
  { id: 'sh-7', query: 'Recycling centers', wasteType: 'Other', location: 'Singanallur', date: '2025-06-28T13:00:00Z' },
  { id: 'sh-8', query: 'Plastic buy back', wasteType: 'Plastic', location: 'Sulur', date: '2025-06-25T15:30:00Z' },
];
