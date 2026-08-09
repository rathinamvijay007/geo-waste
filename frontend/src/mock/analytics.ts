import type { AnalyticsData, AdminStats, Report } from '../types';

export const mockAdminStats: AdminStats = {
  totalUsers: 1247,
  totalCenters: 86,
  verifiedCenters: 62,
  pendingVerification: 14,
  totalReviews: 3421,
  totalReports: 89,
  pendingReports: 12,
};

export const mockReports: Report[] = [
  { id: 'rep-1', centerId: 'c-5', centerName: 'RS Puram Recycle Point', userId: 'u-2', userName: 'Priya Sharma', type: 'wrong_hours', description: 'The listed Saturday hours are incorrect. They close at 12 PM, not 1 PM.', status: 'pending', createdAt: '2025-07-08T10:00:00Z' },
  { id: 'rep-2', centerId: 'c-9', centerName: 'Sulur Plastic Exchange', userId: 'u-3', userName: 'Arjun Menon', type: 'center_closed', description: 'This center appears to be permanently closed. Visited twice and found it shut.', status: 'investigating', createdAt: '2025-07-05T14:30:00Z' },
  { id: 'rep-3', centerId: 'c-7', centerName: 'Kovai Green Collect', userId: 'u-5', userName: 'Deepa Venkatesh', type: 'wrong_address', description: 'The address should be 36, Trichy Road not 34. Google Maps also shows 36.', status: 'resolved', createdAt: '2025-06-20T09:15:00Z', resolvedAt: '2025-06-22T11:00:00Z' },
  { id: 'rep-4', centerId: 'c-3', centerName: 'Clean India E-Waste Solutions', userId: 'u-6', userName: 'Karthik Rajan', type: 'wrong_waste_types', description: 'They no longer accept general "Other" waste. Only e-waste and batteries now.', status: 'pending', createdAt: '2025-07-07T16:45:00Z' },
  { id: 'rep-5', centerId: 'c-8', centerName: 'EnviroSafe Disposals', userId: 'u-1', userName: 'Vijay Rathinam', type: 'incorrect_phone', description: 'Phone number is not reachable. Tried calling multiple times over a week.', status: 'rejected', createdAt: '2025-06-15T11:30:00Z', resolvedAt: '2025-06-18T09:00:00Z' },
];

export const mockAnalytics: AnalyticsData = {
  userGrowth: [
    { date: '2025-01', value: 120, label: 'Jan' },
    { date: '2025-02', value: 245, label: 'Feb' },
    { date: '2025-03', value: 410, label: 'Mar' },
    { date: '2025-04', value: 580, label: 'Apr' },
    { date: '2025-05', value: 790, label: 'May' },
    { date: '2025-06', value: 1050, label: 'Jun' },
    { date: '2025-07', value: 1247, label: 'Jul' },
  ],
  centerGrowth: [
    { date: '2025-01', value: 34, label: 'Jan' },
    { date: '2025-02', value: 42, label: 'Feb' },
    { date: '2025-03', value: 51, label: 'Mar' },
    { date: '2025-04', value: 59, label: 'Apr' },
    { date: '2025-05', value: 68, label: 'May' },
    { date: '2025-06', value: 78, label: 'Jun' },
    { date: '2025-07', value: 86, label: 'Jul' },
  ],
  searchedWasteTypes: [
    { name: 'E-Waste', value: 2340, color: '#059669' },
    { name: 'Battery', value: 1890, color: '#d97706' },
    { name: 'Plastic', value: 3120, color: '#2563eb' },
    { name: 'Electronics', value: 1560, color: '#7c3aed' },
    { name: 'Other', value: 890, color: '#64748b' },
  ],
  popularCenters: [
    { name: 'TechWaste India', value: 203 },
    { name: 'Zero Waste Cbe', value: 156 },
    { name: 'Green Earth', value: 124 },
    { name: 'EcoSmart Hub', value: 89 },
    { name: 'Nila Battery', value: 72 },
  ],
  reviewActivity: [
    { date: '2025-01', value: 45, label: 'Jan' },
    { date: '2025-02', value: 62, label: 'Feb' },
    { date: '2025-03', value: 78, label: 'Mar' },
    { date: '2025-04', value: 95, label: 'Apr' },
    { date: '2025-05', value: 120, label: 'May' },
    { date: '2025-06', value: 145, label: 'Jun' },
    { date: '2025-07', value: 112, label: 'Jul' },
  ],
  searchActivity: [
    { date: '2025-01', value: 890, label: 'Jan' },
    { date: '2025-02', value: 1230, label: 'Feb' },
    { date: '2025-03', value: 1670, label: 'Mar' },
    { date: '2025-04', value: 2100, label: 'Apr' },
    { date: '2025-05', value: 2560, label: 'May' },
    { date: '2025-06', value: 3200, label: 'Jun' },
    { date: '2025-07', value: 2890, label: 'Jul' },
  ],
  wasteCategoryDistribution: [
    { name: 'E-Waste', value: 28, color: '#059669' },
    { name: 'Battery', value: 22, color: '#d97706' },
    { name: 'Plastic', value: 30, color: '#2563eb' },
    { name: 'Electronics', value: 12, color: '#7c3aed' },
    { name: 'Other', value: 8, color: '#64748b' },
  ],
};
