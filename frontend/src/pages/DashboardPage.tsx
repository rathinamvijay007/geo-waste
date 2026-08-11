import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, Heart, MessageSquare, Compass,
  Clock, Recycle, Droplets, TreePine
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
import LightTunnel from '../components/common/LightTunnel';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const statItems = (eco: EcoImpact, favCount: number) => [
  { label: 'Eco Score', value: `${eco.ecoScore}`, icon: Leaf, color: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/30' },
  { label: 'Waste Recycled', value: `${(eco.plasticRecycled + eco.ewasteRecycled).toFixed(1)} kg`, icon: Recycle, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { label: 'Reviews Posted', value: '8', icon: MessageSquare, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { label: 'Saved Favorites', value: `${favCount}`, icon: Heart, color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
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
    <div style={{ minHeight: '100vh' }} className="pt-32 sm:pt-40 pb-40">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Greeting & Subtitle */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-16 lg:mb-20">
          <span className="eyebrow block mb-4">MEMBER DASHBOARD</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#edf7ee] mb-4">
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Member'}</span> 👋
          </h1>
          <p className="text-base sm:text-lg text-[#edf7ee]/60 font-medium">Here is your personal environmental impact overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-16 lg:mb-24">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-dark rounded-3xl p-8 lg:p-10 border border-[#4ade80]/15 shadow-lg space-y-6"
              >
                <div className={`w-14 h-14 rounded-2xl ${stat.color} border flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl font-black font-display gradient-text tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold text-[#edf7ee]/50 uppercase tracking-widest mt-2.5">{stat.label}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Quick Action Banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-dark-strong rounded-3xl p-10 sm:p-14 lg:p-16 mb-16 lg:mb-28 text-white flex flex-col sm:flex-row items-center justify-between gap-10 shadow-2xl border border-[#4ade80]/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
            <LightTunnel
              cableColor="#22c55e"
              pulseColor="#4ade80"
              tunnelColor="#10b981"
              cableCount={16}
              speed={0.12}
              brightness={1.1}
            />
          </div>
          <div className="text-center sm:text-left space-y-4 relative z-10 max-w-xl">
            <h3 className="font-extrabold font-display text-3xl sm:text-4xl tracking-tight text-[#edf7ee]">Ready to drop off waste?</h3>
            <p className="text-[#edf7ee]/60 text-base leading-relaxed">Find the nearest verified collection center equipped for your items.</p>
          </div>
          <Button variant="ghost" size="lg" className="bg-[#4ade80] text-[#052e16] hover:bg-[#22c55e] font-extrabold shrink-0 shadow-lg px-8 py-4 relative z-10"
            onClick={() => navigate('/explore')} leftIcon={<Compass className="w-5 h-5" />}
          >
            Find Nearby Center
          </Button>
        </motion.div>

        {/* Impact Visual Gauge & Progress breakdown */}
        {ecoStats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-28">
            {/* SVG Eco Gauge */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-5 glass-dark rounded-3xl border border-[#4ade80]/15 p-9 sm:p-12 shadow-xl text-center space-y-8"
            >
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4ade80]">Community Rating Rank</h3>
              
              {/* Circular Gauge */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(74,222,128,0.1)" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="#4ade80" strokeWidth="8" strokeDasharray="264"
                    strokeDashoffset={264 - (264 * ecoStats.ecoScore) / 1000}
                    strokeLinecap="round" fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-4xl font-black font-display gradient-text">{ecoStats.ecoScore}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#4ade80]">Top 5% Eco Pioneer</p>
                </div>
              </div>

              <p className="text-xs text-[#edf7ee]/60 leading-relaxed font-medium">
                You’ve avoided <span className="font-bold text-[#4ade80]">{ecoStats.co2Avoided} kg CO₂</span> and diverted <span className="font-bold text-[#4ade80]">{ecoStats.wasteDiverted} kg</span> from landfills. Keep it up!
              </p>
            </motion.div>

            {/* Environmental Savings breakdown */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="lg:col-span-7 glass-dark rounded-3xl border border-[#4ade80]/15 p-9 sm:p-12 shadow-xl space-y-8 flex flex-col justify-between"
            >
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4ade80]">Environmental Equivalents</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                <div className="p-6 lg:p-8 rounded-2xl bg-[#4ade80]/5 border border-[#4ade80]/15 text-center space-y-3">
                  <TreePine className="w-8 h-8 text-[#4ade80] mx-auto" />
                  <p className="text-2xl font-extrabold font-display text-[#edf7ee]">{Math.round(ecoStats.co2Avoided * 0.05)}</p>
                  <p className="text-xs text-[#edf7ee]/50 font-medium">Trees Planted Eq.</p>
                </div>
                <div className="p-6 lg:p-8 rounded-2xl bg-[#4ade80]/5 border border-[#4ade80]/15 text-center space-y-3">
                  <Droplets className="w-8 h-8 text-[#4ade80] mx-auto" />
                  <p className="text-2xl font-extrabold font-display text-[#edf7ee]">{Math.round(ecoStats.plasticRecycled * 24)}</p>
                  <p className="text-xs text-[#edf7ee]/50 font-medium">Litres Water Saved</p>
                </div>
                <div className="p-6 lg:p-8 rounded-2xl bg-[#4ade80]/5 border border-[#4ade80]/15 text-center space-y-3">
                  <Recycle className="w-8 h-8 text-[#4ade80] mx-auto" />
                  <p className="text-2xl font-extrabold font-display text-[#edf7ee]">{ecoStats.wasteDiverted} kg</p>
                  <p className="text-xs text-[#edf7ee]/50 font-medium">Landfill Diverted</p>
                </div>
              </div>

              <div className="space-y-5 pt-6 border-t border-white/10">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#edf7ee]/80">Plastic Recycling Goal</span>
                    <span className="text-[#4ade80]">{ecoStats.plasticRecycled} / 50 kg</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (ecoStats.plasticRecycled / 50) * 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#edf7ee]/80">E-Waste Safe Disposal</span>
                    <span className="text-[#4ade80]">{ecoStats.ewasteRecycled} / 25 kg</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#16a34a] to-[#34d399] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (ecoStats.ewasteRecycled / 25) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Featured Drop-Off Centers */}
        <div className="mb-20 lg:mb-28">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="eyebrow block mb-2.5">NEARBY HUBS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#edf7ee]">Recommended Centers</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/explore')} className="text-[#4ade80] hover:text-[#86efac]">
              View All Centers →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {recentCenters.map((center, idx) => (
              <CenterCard key={center.id} center={center} index={idx} />
            ))}
          </div>
        </div>

        {/* Recent Search History */}
        {recentSearches.length > 0 && (
          <div className="glass-dark rounded-3xl p-8 lg:p-10 border border-[#4ade80]/15">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#4ade80] mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Searches
            </h3>
            <div className="flex flex-wrap gap-3">
              {recentSearches.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/explore?query=${encodeURIComponent(item.query)}`)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#4ade80]/10 border border-white/10 hover:border-[#4ade80]/30 text-xs font-bold text-[#edf7ee]/80 transition-all cursor-pointer"
                >
                  🔍 {item.query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
