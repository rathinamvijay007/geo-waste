import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { adminApi } from '../../api/adminApi';
import type { AnalyticsData } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout title="Analytics & Insights" description="Platform performance, search metrics, and growth stats">
        <LoadingSpinner text="Loading analytics charts..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics & Insights" description="Platform growth, popular waste categories, and center metrics">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* User & Center Growth */}
        <div className="glass-panel rounded-3xl border border-white/80 p-8 shadow-xl">
          <h3 className="font-extrabold font-display text-[#1b251f] text-lg mb-1">User & Center Growth</h3>
          <p className="text-xs font-medium text-[#556358] mb-6">Monthly growth trends for registered users and verified centers</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeae4" />
                <XAxis dataKey="label" stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Users" stroke="#22c55e" strokeWidth={3} dot={{ r: 5, fill: '#143e2b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Searched Waste Types */}
        <div className="glass-panel rounded-3xl border border-white/80 p-8 shadow-xl">
          <h3 className="font-extrabold font-display text-[#1b251f] text-lg mb-1">Most Searched Waste Types</h3>
          <p className="text-xs font-medium text-[#556358] mb-6">Total searches per waste category across all regions</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.searchedWasteTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeae4" />
                <XAxis dataKey="name" stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#ebf5ed' }} />
                <Bar dataKey="value" name="Searches" radius={[8, 8, 0, 0]}>
                  {data.searchedWasteTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Category Distribution */}
        <div className="glass-panel rounded-3xl border border-white/80 p-8 shadow-xl">
          <h3 className="font-extrabold font-display text-[#1b251f] text-lg mb-1">Waste Category Distribution</h3>
          <p className="text-xs font-medium text-[#556358] mb-6">Percentage share of waste dropped off by category</p>
          <div className="h-64 w-full flex items-center justify-center">
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
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {data.wasteCategoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#22c55e'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Centers */}
        <div className="glass-panel rounded-3xl border border-white/80 p-8 shadow-xl">
          <h3 className="font-extrabold font-display text-[#1b251f] text-lg mb-1">Top Visited Centers</h3>
          <p className="text-xs font-medium text-[#556358] mb-6">Centers with highest user engagement and review counts</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.popularCenters}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeae4" />
                <XAxis type="number" stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#788a7e" fontSize={12} tickLine={false} axisLine={false} width={110} />
                <Tooltip cursor={{ fill: '#ebf5ed' }} />
                <Bar dataKey="value" name="Reviews/Visits" fill="#22c55e" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

