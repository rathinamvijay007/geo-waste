import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Loader2,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Plus,
  Minus,
  RotateCcw,
  List,
  Grid,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { centerApi } from '../api/centerApi';
import { useLocation } from '../context/LocationContext';
import type { CollectionCenter, ExploreFilters } from '../types';
import { CenterCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ExploreMap from '../components/map/ExploreMap';
import { ParticleCard } from '../components/common/MagicBento';

const defaultFilters: ExploreFilters = {
  wasteType: 'All',
  distance: 50,
  rating: 0,
  verifiedOnly: false,
  openNow: false,
  sortBy: 'nearest',
  searchQuery: '',
};

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const { userLocation, permissionStatus, isDetecting, detectLocation, error: locationError } = useLocation();
  const [centers, setCenters] = useState<CollectionCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExploreFilters>(() => {
    const wasteParam = searchParams.get('waste');
    return { ...defaultFilters, wasteType: wasteParam || 'All' };
  });
  const [searchInput, setSearchInput] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch centers from API
  const fetchCenters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await centerApi.getCenters(filters);
      setCenters(data);
    } catch {
      setError('Unable to load collection centers.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.wasteType !== 'All') count++;
    if (filters.distance < 50) count++;
    if (filters.rating > 0) count++;
    if (filters.verifiedOnly) count++;
    if (filters.openNow) count++;
    return count;
  }, [filters]);

  const selectedCenterData = useMemo(
    () => centers.find(c => c.id === selectedCenter),
    [centers, selectedCenter]
  );

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchInput('');
  };

  const wasteCategories = ['E-Waste', 'Battery', 'Plastic', 'Glass', 'Paper & Cardboard'];

  return (
    <div className="min-h-screen bg-[#0d0f0d] text-[#e2e3df] font-sans flex flex-col pb-20 overflow-x-hidden">
      {/* ── TOP SECTION: ULTRA-SPACIOUS SEARCH & HORIZONTAL FILTER HEADER CARD ── */}
      {/* mt-14 lg:mt-18 guarantees complete clearance below top floating Navbar pills */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-12 mt-14 lg:mt-18 mb-10 z-30">
        <ParticleCard
          glowColor="74, 222, 128"
          particleCount={10}
          clickEffect={false}
          className="bg-[#121412] border border-white/10 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl space-y-8"
        >
          {/* Row 1: Search Bar Input & Use My Location */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-2/3 max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a1d494] w-5.5 h-5.5 z-10" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search center name, city, or street..."
                className="w-full bg-[#1c1e1c] text-[#e2e3df] font-medium text-base pl-16 pr-14 py-4.5 rounded-2xl border border-white/15 focus:outline-none focus:border-[#a1d494] transition-all placeholder:text-[#c2c9bb]/60 shadow-inner"
                aria-label="Search centers"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#c2c9bb] hover:text-[#a1d494] p-1.5 cursor-pointer z-10 transition-colors"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={detectLocation}
                disabled={isDetecting}
                className="flex items-center gap-3.5 text-[#a1d494] hover:text-[#bcf0ae] transition-all whitespace-nowrap px-7 py-4.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider cursor-pointer border border-[#a1d494]/40 hover:bg-[#a1d494]/15 bg-[#a1d494]/5 shadow-md"
              >
                {isDetecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#a1d494]" />
                ) : (
                  <Navigation className="w-5 h-5 text-[#a1d494]" />
                )}
                <span>{permissionStatus === 'granted' ? 'Location Detected' : 'Use My Location'}</span>
              </button>

              {/* Mobile Filter Drawer Toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-3 px-6 py-4.5 rounded-2xl bg-[#1c1e1c] border border-white/15 text-xs font-extrabold text-[#a1d494] hover:bg-[#292a28] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-5 h-5 text-[#a1d494]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5.5 h-5.5 rounded-full bg-[#a1d494] text-[#0a3909] text-[11px] flex items-center justify-center font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Location Banners */}
          {locationError && permissionStatus === 'denied' && (
            <div>
              <p className="text-xs text-amber-300 bg-amber-500/10 px-6 py-3 rounded-full border border-amber-500/20 font-semibold w-fit">
                {locationError}
              </p>
            </div>
          )}
          {userLocation && (
            <div>
              <p className="text-xs text-[#a1d494] bg-[#a1d494]/10 px-6 py-3 rounded-full border border-[#a1d494]/20 font-semibold flex items-center gap-3 w-fit">
                <MapPin className="w-4.5 h-4.5 text-[#a1d494]" />
                <span>Location set to <strong>{userLocation.address}, {userLocation.city}</strong></span>
              </p>
            </div>
          )}

          {/* Row 2: Horizontal Filters Bar Controls with Generous Inner Padding & Clean Gaps */}
          <div className="hidden md:flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-white/10">
            {/* Waste Category Pills */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#a1d494] uppercase tracking-wider mr-4 hidden lg:inline">
                Waste Category:
              </span>
              {['All', ...wasteCategories].map(cat => {
                const isChecked = filters.wasteType === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilters(prev => ({ ...prev, wasteType: cat }))}
                    className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2.5 border ${isChecked
                        ? 'bg-[#a1d494] text-[#0a3909] font-black border-[#a1d494] shadow-lg scale-105'
                        : 'bg-[#1c1e1c] text-[#e2e3df] border-white/12 hover:border-[#a1d494]/50 hover:bg-[#292a28]'
                      }`}
                  >
                    {isChecked && <Check className="w-4 h-4 text-[#0a3909] stroke-[3]" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Distance, Rating, & Reset Controls */}
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              {/* Distance Radius */}
              <div className="flex items-center gap-4 bg-[#1c1e1c] px-6 py-3.5 rounded-2xl border border-white/12">
                <span className="text-xs font-mono text-[#c2c9bb] font-bold">Distance:</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.distance}
                  onChange={e => setFilters(prev => ({ ...prev, distance: Number(e.target.value) }))}
                  className="w-36 accent-[#a1d494] bg-[#292a28] h-2 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#a1d494] bg-[#a1d494]/10 px-3 py-1.5 rounded-lg border border-[#a1d494]/20 min-w-[52px] text-center">
                  {filters.distance} km
                </span>
              </div>

              {/* Minimum Rating */}
              <div className="flex items-center gap-2.5 bg-[#1c1e1c] p-2 rounded-2xl border border-white/12">
                <span className="text-xs font-mono text-[#c2c9bb] font-bold px-3">Rating:</span>
                {[0, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === r ? 0 : r }))}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${filters.rating === r && r > 0
                        ? 'bg-[#a1d494] text-[#0a3909] font-black shadow-md'
                        : 'text-[#c2c9bb] hover:text-white'
                      }`}
                  >
                    {r === 0 ? 'All' : `${r}+`}
                  </button>
                ))}
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={resetFilters}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#292a28] text-[#a1d494] text-xs font-mono font-extrabold uppercase tracking-wider hover:bg-[#333533] transition-all border border-white/12 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </ParticleCard>
      </div>

      {/* ── MAIN CONTENT WORKSPACE: LARGE MAP (LEFT) & HUBS PANEL (RIGHT) ─ */}
      <div className="flex-1 w-full max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row gap-10 items-stretch">
        {/* ── 1. LARGE MAP INTERFACE (LEFT / DOMINANT AREA) ───────────── */}
        <section className={`flex-1 bg-[#121412] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden h-[650px] lg:h-[780px] z-10 ${mobileSheetExpanded ? 'hidden lg:block' : 'block'
          }`}>
          {/* Interactive Leaflet Map */}
          <ExploreMap
            centers={centers}
            selectedCenter={selectedCenterData}
            userLocation={userLocation}
            onSelectCenter={setSelectedCenter}
          />

          {/* Map Controls Overlay */}
          <div className="absolute bottom-8 right-8 z-30 flex flex-col gap-3">
            <button
              onClick={() => { }}
              className="w-12 h-12 bg-[#121412]/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/15 flex items-center justify-center text-[#e2e3df] hover:text-[#a1d494] transition-colors cursor-pointer"
              aria-label="Zoom in"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => { }}
              className="w-12 h-12 bg-[#121412]/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/15 flex items-center justify-center text-[#e2e3df] hover:text-[#a1d494] transition-colors cursor-pointer"
              aria-label="Zoom out"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={detectLocation}
              className="w-12 h-12 bg-[#a1d494]/20 backdrop-blur-md rounded-2xl shadow-xl border border-[#a1d494]/50 flex items-center justify-center text-[#a1d494] mt-1 hover:bg-[#a1d494]/30 transition-colors cursor-pointer"
              aria-label="Locate me"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* ── 2. VERIFIED HUBS PANEL (RIGHT / SCROLLABLE LIST) ─────────── */}
        <section
          className={`w-full lg:w-[500px] xl:w-[540px] shrink-0 bg-[#121412] rounded-3xl border border-white/10 p-7 sm:p-9 flex flex-col h-[650px] lg:h-[780px] shadow-2xl overflow-hidden relative z-20 ${mobileSheetExpanded ? 'block' : 'hidden lg:flex'
            }`}
        >
          {/* Header & View Mode Switch */}
          <div className="flex justify-between items-end pb-5 border-b border-white/10 shrink-0 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e2e3df] tracking-tight">Verified Hubs</h1>
              <p className="text-xs sm:text-sm text-[#c2c9bb] mt-2 font-medium">
                {loading ? 'Searching centers...' : `Found ${centers.length} collection centers near you`}
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#292a28] text-[#a1d494] border border-[#a1d494]/40' : 'text-[#c2c9bb] hover:text-[#e2e3df]'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#292a28] text-[#a1d494] border border-[#a1d494]/40' : 'text-[#c2c9bb] hover:text-[#e2e3df]'
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Scroll Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
            {loading && (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => <CenterCardSkeleton key={i} />)}
              </div>
            )}

            {error && <ErrorState message={error} onRetry={fetchCenters} />}

            {!loading && !error && centers.length === 0 && (
              <EmptyState
                title="No centers found"
                description="No recycling centers match your selected filters. Try adjusting your search query or radius."
                actionLabel="Reset Filters"
                onAction={resetFilters}
              />
            )}

            {!loading && !error && centers.length > 0 && (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'flex flex-col gap-6'}>
                {centers.map((center) => {
                  const isSelected = selectedCenter === center.id;
                  const acceptedList = center.acceptedWaste || [];
                  const closingTime = center.operatingHours?.[0]?.close || '8 PM';
                  return (
                    <ParticleCard
                      key={center.id}
                      clickEffect={true}
                      glowColor="74, 222, 128"
                      particleCount={8}
                      onClick={() => setSelectedCenter(center.id)}
                      className={`group bg-[#1c1e1c] rounded-2xl p-7 sm:p-8 border transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative overflow-hidden cursor-pointer flex flex-col gap-6 ${isSelected
                          ? 'border-[#a1d494] shadow-[0_0_32px_rgba(161,212,148,0.25)] ring-1 ring-[#a1d494]/50'
                          : 'border-white/12 hover:border-[#a1d494]/60'
                        }`}
                    >
                      {/* Ambient Glow */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#a1d494]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                      <div className="flex justify-between items-start gap-4 relative z-10 pb-0.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4.5 h-4.5 text-[#a1d494]" />
                            <span className="text-xs font-mono font-bold text-[#a1d494] uppercase tracking-widest">
                              {center.verified ? 'EcoRecycle Center' : 'Collection Hub'}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#e2e3df] group-hover:text-[#a1d494] transition-colors leading-snug">
                            {center.name}
                          </h3>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1.5 text-[#95d4ac] bg-[#95d4ac]/10 px-3 py-1 rounded-full border border-[#95d4ac]/20">
                            <span className="text-xs font-extrabold">{center.rating.toFixed(1)}</span>
                            <Star className="w-3.5 h-3.5 fill-[#95d4ac] text-[#95d4ac]" />
                          </div>
                          <span className="text-xs text-[#c2c9bb] mt-1.5 font-mono">({center.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[#c2c9bb] text-xs sm:text-sm font-medium relative z-10 leading-relaxed">
                        <MapPin className="w-4.5 h-4.5 text-[#a1d494] shrink-0" />
                        <span>{center.address}, {center.city} • {center.distance ? `${center.distance.toFixed(1)} km away` : 'Coimbatore'}</span>
                      </div>

                      {/* Accepted Waste Badges */}
                      <div className="flex flex-wrap gap-2.5 relative z-10">
                        {acceptedList.map((wt: string, idx: number) => {
                          const badgeStyle = idx === 0
                            ? 'bg-[#a1d494]/10 text-[#a1d494] border-[#a1d494]/25'
                            : idx === 1
                              ? 'bg-[#165637]/40 text-[#8acaa1] border-[#165637]/60'
                              : 'bg-[#292a28] text-[#e2e3df] border-white/10';
                          return (
                            <span
                              key={wt}
                              className={`px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-2 ${badgeStyle}`}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#a1d494]" /> {wt}
                            </span>
                          );
                        })}
                      </div>

                      {/* Bottom Operating Info & Directions Button */}
                      <div className="flex justify-between items-center pt-5 border-t border-white/10 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#a1d494] animate-pulse" />
                          <span className="text-xs sm:text-sm font-semibold text-[#e2e3df]">
                            Open Now <span className="text-[#c2c9bb] font-normal">• Closes {closingTime}</span>
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`, '_blank');
                          }}
                          className="px-6 py-3 rounded-full bg-transparent border border-[#a1d494] text-[#a1d494] text-xs font-extrabold hover:bg-[#a1d494] hover:text-[#0a3909] transition-all flex items-center gap-2.5 group-hover:bg-[#a1d494] group-hover:text-[#0a3909] cursor-pointer shadow-sm"
                        >
                          Directions <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </ParticleCard>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── MOBILE BOTTOM SHEET TOGGLE ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1e201e]/95 backdrop-blur-xl border-t border-white/10 p-4 text-center">
        <button
          onClick={() => setMobileSheetExpanded(!mobileSheetExpanded)}
          className="text-xs font-bold text-[#a1d494] flex items-center justify-center gap-2 w-full py-2 cursor-pointer"
        >
          <span>{mobileSheetExpanded ? 'View Map View' : `View ${centers.length} Hubs List`}</span>
        </button>
      </div>

      {/* ── MOBILE FILTER DRAWER ───────────────────────────────────────── */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#121412]/80 backdrop-blur-md"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-84 max-w-full bg-[#1e201e] shadow-2xl overflow-y-auto border-l border-white/10 p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-[#e2e3df] text-base">Filter Discovery</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-[#c2c9bb] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-[#c2c9bb] uppercase tracking-widest">Category</h4>
                <div className="space-y-2">
                  {['All', ...wasteCategories].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(prev => ({ ...prev, wasteType: cat }))}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filters.wasteType === cat
                          ? 'bg-[#a1d494] text-[#0a3909]'
                          : 'bg-[#292a28] text-[#e2e3df] hover:bg-[#333533]'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 rounded-full bg-[#a1d494] text-[#0a3909] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Apply Filters ({activeFiltersCount})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
