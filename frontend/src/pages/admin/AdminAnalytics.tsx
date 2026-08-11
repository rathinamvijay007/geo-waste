import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { adminApi } from '../../api/adminApi';
import type { AnalyticsData } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout
        title="Analytics & Insights"
        description="Platform performance, search metrics, and growth stats"
      >
        <LoadingSpinner text="Loading analytics charts..." />
      </AdminLayout>
    );
  }

  const tooltipStyle = {
    backgroundColor: '#0d1611',
    borderColor: 'rgba(74, 222, 128, 0.2)',
    borderRadius: '12px',
    color: '#edf7ee',
  };

  return (
    <AdminLayout
      title="Analytics & Insights"
      description="Platform growth, popular waste categories, and center metrics"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 mb-10">
        {/* User & Center Growth */}
        <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-xl">
          <h3 className="font-extrabold font-display text-[#edf7ee] text-lg mb-2">
            User & Center Growth
          </h3>
          <p className="text-xs font-normal text-[#edf7ee]/60 mb-7">
            Monthly growth trends for registered users and verified centers
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.06)"
                />
                <XAxis
                  dataKey="label"
                  stroke="#edf7ee"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#edf7ee"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Users"
                  stroke="#4ade80"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Searched Waste Types */}
        <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-xl">
          <h3 className="font-extrabold font-display text-[#edf7ee] text-lg mb-2">
            Most Searched Waste Types
          </h3>
          <p className="text-xs font-normal text-[#edf7ee]/60 mb-7">
            Total searches per waste category across all regions
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.searchedWasteTypes}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.06)"
                />
                <XAxis
                  dataKey="name"
                  stroke="#edf7ee"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#edf7ee"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Searches" radius={[8, 8, 0, 0]}>
                  {data.searchedWasteTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || '#4ade80'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Category Distribution */}
        <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-xl">
          <h3 className="font-extrabold font-display text-[#edf7ee] text-lg mb-2">
            Waste Category Distribution
          </h3>
          <p className="text-xs font-normal text-[#edf7ee]/60 mb-7">
            Percentage share of waste dropped off by category
          </p>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.wasteCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string;
                    percent?: number;
                  }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {data.wasteCategoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || '#4ade80'}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Centers */}
        <div className="bg-[#0d1611]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-xl">
          <h3 className="font-extrabold font-display text-[#edf7ee] text-lg mb-2">
            Top Visited Centers
          </h3>
          <p className="text-xs font-normal text-[#edf7ee]/60 mb-7">
            Centers with highest user engagement and review counts
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.popularCenters}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.06)"
                />
                <XAxis
                  type="number"
                  stroke="#edf7ee"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#edf7ee"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="value"
                  name="Reviews/Visits"
                  fill="#4ade80"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
