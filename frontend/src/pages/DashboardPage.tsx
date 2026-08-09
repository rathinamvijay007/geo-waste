import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Heart, MessageSquare, Compass, TrendingUp,
  ArrowRight, Clock, Recycle, Droplets, TreePine, Battery, Package, Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ecoImpactApi } from '../api/ecoImpactApi';
import { centerApi } from '../api/centerApi';
import { historyApi } from '../api/historyApi';
import type { EcoImpact, CollectionCenter, SearchHistoryItem } from '../types';
import CenterCard from '../components/center/CenterCard';
import Button from '../components/common/Button';
import { StatCardSkeleton } from '../components/common/Skeleton';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const statItems = (eco: EcoImpact, favCount: number) => [
  { label: 'Eco Score', value: `${eco.ecoScore}`, icon: Leaf, color: 'bg-eco-50 text-eco-700 border-eco-200/60' },
  { label: 'Waste Recycled', value: `${(eco.plasticRecycled + eco.ewasteRecycled).toFixed(1)} kg`, icon: Recycle, color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  { label: 'Reviews Posted', value: '8', icon: MessageSquare, color: 'bg-blue-50 text-blue-700 border-blue-200/60' },
  { label: 'Saved Favorites', value: `${favCount}`, icon: Heart, color: 'bg-rose-50 text-rose-600 border-rose-200/60' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ecoStats, setEcoStats] = useState<EcoImpact | null>(null);
  const [recentCenters, setRecentCenters] = useState<CollectionCenter[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ecoImpactApi.getEcoStats(),
      centerApi.getPopularCenters(),
      historyApi.getHistory(),
    ]).then(([eco, centers, history]) => {
      setEcoStats(eco);
      setRecentCenters(centers.slice(0, 3));
      setRecentSearches(history.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const stats = ecoStats ? statItems(ecoStats, 5) : [];

  return (
    <div className="pt-20 pb-28 min-h-screen bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting & Subtitle */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Member'} 👋
          </h1>
          <p className="text-sm text-surface-500 font-medium">Here is your personal environmental impact overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-surface-200/80 p-5 sm:p-6 shadow-2xs"
              >
                <div className={`w-11 h-11 rounded-2xl ${stat.color} border flex items-center justify-center mb-4`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Quick Action Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-eco-900 via-eco-800 to-eco-950 rounded-3xl p-6 sm:p-8 mb-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-eco-900/10 border border-eco-900/20"
        >
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-bold text-xl tracking-tight">Ready to drop off waste?</h3>
            <p className="text-eco-200/80 text-xs sm:text-sm">Find the nearest verified collection center equipped for your items.</p>
          </div>
          <Button variant="ghost" size="md" className="bg-white text-eco-900 hover:bg-eco-50 font-bold shrink-0"
            rightIcon={<Compass className="w-4 h-4" />}
            onClick={() => navigate('/explore')}
          >
            Find Drop-off Center
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Eco Impact Visualizer — Feature #35 */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-eco-700" /> Environmental Contribution
            </h3>
            {ecoStats && (
              <div className="space-y-5">
                {[
                  { label: 'Plastic Materials Recycled', value: ecoStats.plasticRecycled, unit: 'kg', icon: Package, color: 'bg-blue-600', max: 20 },
                  { label: 'Batteries Disposed Safely', value: ecoStats.batteriesRecycled, unit: 'units', icon: Battery, color: 'bg-amber-500', max: 10 },
                  { label: 'E-Waste Processed', value: ecoStats.ewasteRecycled, unit: 'kg', icon: Monitor, color: 'bg-emerald-600', max: 10 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-surface-700 flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-surface-400" /> {item.label}
                      </span>
                      <span className="text-xs font-bold text-surface-900">{item.value} {item.unit}</span>
                    </div>
                    <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-100">
                  <div className="bg-eco-50/60 border border-eco-200/60 rounded-2xl p-4 text-center">
                    <Droplets className="w-5 h-5 text-eco-700 mx-auto mb-1" />
                    <p className="text-xl font-extrabold text-eco-950">{ecoStats.co2Avoided} kg</p>
                    <p className="text-[11px] font-semibold text-eco-700 uppercase tracking-wider">CO₂ Avoided</p>
                  </div>
                  <div className="bg-eco-50/60 border border-eco-200/60 rounded-2xl p-4 text-center">
                    <TreePine className="w-5 h-5 text-eco-700 mx-auto mb-1" />
                    <p className="text-xl font-extrabold text-eco-950">{ecoStats.wasteDiverted} kg</p>
                    <p className="text-[11px] font-semibold text-eco-700 uppercase tracking-wider">Waste Diverted</p>
                  </div>
                </div>

                {/* Eco Score Circular Gauge */}
                <div className="flex items-center gap-5 p-5 bg-surface-50 rounded-2xl border border-surface-200/60">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#e7e5e4" strokeWidth="5" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#16a34a" strokeWidth="5"
                        strokeDasharray={`${(ecoStats.ecoScore / 100) * 176} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-eco-900">
                      {ecoStats.ecoScore}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-surface-900 text-sm">Overall Eco Score</p>
                    <p className="text-xs text-surface-500 leading-relaxed mt-0.5">Top 15% active contributor. Keep recycling to boost your score.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Searches Sidebar */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl border border-surface-200/80 p-6 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-surface-400" /> Recent Searches
                </h3>
                <Link to="/history" className="text-xs text-eco-700 hover:text-eco-900 font-semibold">View All</Link>
              </div>
              {recentSearches.length === 0 ? (
                <p className="text-xs text-surface-500 text-center py-6">No recent searches recorded</p>
              ) : (
                <div className="space-y-2">
                  {recentSearches.map(search => (
                    <Link
                      key={search.id}
                      to={`/explore?waste=${search.wasteType}`}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-50 transition-colors border border-transparent hover:border-surface-200/60"
                    >
                      <div className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-500 shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-surface-900 truncate">{search.query}</p>
                        <p className="text-[11px] text-surface-500">{search.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recommended Centers — Features #27, #28 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-surface-900 tracking-tight">Recommended Centers Nearby</h3>
            <Link to="/explore" className="text-xs font-semibold text-eco-700 hover:text-eco-900 flex items-center gap-1">
              View All Centers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCenters.map((center, i) => (
              <CenterCard key={center.id} center={center} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
