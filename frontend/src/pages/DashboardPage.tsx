import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Heart, MessageSquare, Compass,
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
  { label: 'Eco Score', value: `${eco.ecoScore}`, icon: Leaf, color: 'bg-[#ebf5ed] text-[#143e2b] border-[#22c55e]/30' },
  { label: 'Waste Recycled', value: `${(eco.plasticRecycled + eco.ewasteRecycled).toFixed(1)} kg`, icon: Recycle, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' },
  { label: 'Reviews Posted', value: '8', icon: MessageSquare, color: 'bg-blue-500/10 text-blue-700 border-blue-500/30' },
  { label: 'Saved Favorites', value: `${favCount}`, icon: Heart, color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' },
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
    <div className="py-20 sm:py-28 lg:py-36 min-h-screen bg-ambient-light">
      <div className="max-w-7xl lg:max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Greeting & Subtitle */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-2">MEMBER DASHBOARD</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#1b251f] tracking-tight mb-3">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Member'} 👋
          </h1>
          <p className="text-base sm:text-lg text-[#556358] font-medium">Here is your personal environmental impact overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-14">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-3xl p-8 border border-white/80 shadow-lg space-y-5"
              >
                <div className={`w-14 h-14 rounded-2xl ${stat.color} border flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl font-black font-display text-[#1b251f] tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold text-[#556358] uppercase tracking-widest mt-2">{stat.label}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Quick Action Banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-ambient-dark rounded-3xl p-10 sm:p-14 lg:p-16 mb-16 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22c55e]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="text-center sm:text-left space-y-3 relative z-10 max-w-xl">
            <h3 className="font-extrabold font-display text-3xl sm:text-4xl tracking-tight">Ready to drop off waste?</h3>
            <p className="text-[#c3ded0] text-base leading-relaxed">Find the nearest verified collection center equipped for your items.</p>
          </div>
          <Button variant="ghost" size="lg" className="bg-[#4ade80] text-[#070e0b] hover:bg-[#22c55e] font-extrabold shrink-0 shadow-lg px-8 py-4 relative z-10"
            onClick={() => navigate('/explore')} leftIcon={<Compass className="w-5 h-5" />}
          >
            Find Nearby Center
          </Button>
        </motion.div>

        {/* Impact Visual Gauge & Progress breakdown */}
        {ecoStats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            {/* SVG Eco Gauge */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-5 glass-panel rounded-3xl border border-white/80 p-9 sm:p-12 shadow-xl text-center space-y-6"
            >
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b]">Community Rating Rank</h3>
              
              {/* Circular Gauge */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#e5ebe7" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="#22c55e" strokeWidth="8" strokeDasharray="264"
                    strokeDashoffset={264 - (264 * ecoStats.ecoScore) / 1000}
                    strokeLinecap="round" fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-4xl font-black font-display text-[#143e2b]">{ecoStats.ecoScore}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#556358]">Top 5% Eco Pioneer</p>
                </div>
              </div>

              <p className="text-xs text-[#556358] leading-relaxed font-medium">
                You’ve avoided <span className="font-bold text-[#143e2b]">{ecoStats.co2Avoided} kg CO₂</span> and diverted <span className="font-bold text-[#143e2b]">{ecoStats.wasteDiverted} kg</span> from landfills. Keep it up!
              </p>
            </motion.div>

            {/* Environmental Savings breakdown */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="lg:col-span-7 glass-panel rounded-3xl border border-white/80 p-9 sm:p-12 shadow-xl space-y-8"
            >
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b]">Environmental Contribution</h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Plastic Materials Recycled', value: ecoStats.plasticRecycled, unit: 'kg', icon: Package, color: 'bg-blue-600', max: 20 },
                  { label: 'Batteries Disposed Safely', value: ecoStats.batteriesRecycled, unit: 'units', icon: Battery, color: 'bg-amber-500', max: 10 },
                  { label: 'E-Waste Processed', value: ecoStats.ewasteRecycled, unit: 'kg', icon: Monitor, color: 'bg-[#22c55e]', max: 10 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#4a554e] flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-[#788a7e]" /> {item.label}
                      </span>
                      <span className="text-xs font-black font-display text-[#1b251f]">{item.value} {item.unit}</span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-[#eaeae4]">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-5 pt-4 border-t border-[#eaeae4]">
                  <div className="bg-[#ebf5ed]/80 border border-[#22c55e]/30 rounded-2xl p-5 text-center shadow-xs">
                    <Droplets className="w-6 h-6 text-[#22c55e] mx-auto mb-1.5" />
                    <p className="text-2xl font-black font-display text-[#143e2b]">{ecoStats.co2Avoided} kg</p>
                    <p className="text-[11px] font-bold text-[#143e2b] uppercase tracking-widest mt-0.5">CO₂ Avoided</p>
                  </div>
                  <div className="bg-[#ebf5ed]/80 border border-[#22c55e]/30 rounded-2xl p-5 text-center shadow-xs">
                    <TreePine className="w-6 h-6 text-[#22c55e] mx-auto mb-1.5" />
                    <p className="text-2xl font-black font-display text-[#143e2b]">{ecoStats.wasteDiverted} kg</p>
                    <p className="text-[11px] font-bold text-[#143e2b] uppercase tracking-widest mt-0.5">Waste Diverted</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Featured Nearby Centers Grid */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">FEATURED LOCATIONS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1b251f] tracking-tight">Verified Centers Near You</h2>
            </div>
            <Link to="/explore" className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentCenters.map((center, idx) => (
              <CenterCard key={center.id} center={center} index={idx} />
            ))}
          </div>
        </div>

        {/* Recent Search Activity */}
        <div className="glass-panel rounded-3xl border border-white/80 p-9 sm:p-12 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#22c55e]" /> Recent Searches
            </h3>
            <Link to="/history" className="text-xs font-bold text-[#556358] hover:text-[#143e2b]">Manage History</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSearches.map(item => (
              <Link
                key={item.id}
                to={`/explore?query=${encodeURIComponent(item.query)}`}
                className="p-4 rounded-2xl bg-white/90 border border-[#eaeae4] hover:bg-[#ebf5ed] hover:border-[#22c55e]/40 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <p className="text-xs font-extrabold text-[#1b251f]">{item.query}</p>
                  <p className="text-[10px] text-[#788a7e] font-semibold">{item.wasteType} • {item.location}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#788a7e] group-hover:translate-x-1 group-hover:text-[#143e2b] transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
