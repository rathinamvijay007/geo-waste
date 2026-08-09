// ==========================================
// EcoDrop — Core Type Definitions
// ==========================================

// --- Auth & User ---
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// --- Waste Categories ---
export interface WasteCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  examples: string[];
}

// --- Collection Centers ---
export interface CollectionCenter {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  acceptedWaste: string[];
  operatingHours: OperatingHours[];
  images: string[];
  distance?: number;
  isOpen?: boolean;
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// --- Reviews ---
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  centerId: string;
  centerName?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'flagged' | 'removed';
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

// --- Favorites ---
export interface Favorite {
  id: string;
  userId: string;
  centerId: string;
  center: CollectionCenter;
  createdAt: string;
}

// --- Location ---
export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  accuracy?: number;
}

export type LocationPermissionStatus = 'prompt' | 'granted' | 'denied' | 'loading' | 'error';

// --- Search & History ---
export interface SearchQuery {
  query: string;
  wasteType?: string;
  location?: string;
  timestamp: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  wasteType: string;
  location: string;
  date: string;
}

// --- Filters ---
export interface ExploreFilters {
  wasteType: string;
  distance: number;
  rating: number;
  verifiedOnly: boolean;
  openNow: boolean;
  sortBy: 'nearest' | 'highest_rated' | 'most_popular';
  searchQuery: string;
}

// --- Reports ---
export interface Report {
  id: string;
  centerId: string;
  centerName: string;
  userId: string;
  userName: string;
  type: ReportType;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
}

export type ReportType =
  | 'wrong_address'
  | 'wrong_hours'
  | 'center_closed'
  | 'wrong_waste_types'
  | 'incorrect_phone'
  | 'other';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'rejected';

export interface ReportFormData {
  type: ReportType;
  description: string;
}

// --- Eco Impact ---
export interface EcoImpact {
  plasticRecycled: number;
  batteriesRecycled: number;
  ewasteRecycled: number;
  co2Avoided: number;
  wasteDiverted: number;
  ecoScore: number;
}

// --- Admin Analytics ---
export interface AnalyticsData {
  userGrowth: TimeSeriesData[];
  centerGrowth: TimeSeriesData[];
  searchedWasteTypes: CategoryCount[];
  popularCenters: CategoryCount[];
  reviewActivity: TimeSeriesData[];
  searchActivity: TimeSeriesData[];
  wasteCategoryDistribution: CategoryCount[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface CategoryCount {
  name: string;
  value: number;
  color?: string;
}

// --- Admin Stats ---
export interface AdminStats {
  totalUsers: number;
  totalCenters: number;
  verifiedCenters: number;
  pendingVerification: number;
  totalReviews: number;
  totalReports: number;
  pendingReports: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
