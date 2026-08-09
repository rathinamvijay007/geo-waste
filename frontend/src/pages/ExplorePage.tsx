import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { centerApi } from '../api/centerApi';
import { useLocation } from '../context/LocationContext';
import type { CollectionCenter, ExploreFilters } from '../types';
import CenterCard from '../components/center/CenterCard';
import { CenterCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';
import ExploreMap from '../components/map/ExploreMap';
import FilterPanel from '../components/filters/FilterPanel';

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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch centers
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

  const resetFilters = () => setFilters(defaultFilters);

  const wasteTypes = ['All', 'E-Waste', 'Battery', 'Plastic', 'Electronics', 'Other'];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-ambient-light">
      {/* Top Controls Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[#eaeae4] px-4 sm:px-8 py-4 shadow-xs z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#788a7e]" />
            <input
              type="text"
              placeholder="Search center name, city, or street..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[#d5ded8] bg-white/90 text-sm font-semibold text-[#1b251f] placeholder:text-[#8b9b90] focus:bg-white focus:ring-4 focus:ring-[#22c55e]/15 focus:border-[#22c55e] outline-none transition-all shadow-2xs"
              aria-label="Search centers"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#788a7e] hover:text-[#143e2b] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Button */}
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
              permissionStatus === 'granted'
                ? 'bg-[#ebf5ed] text-[#143e2b] border border-[#22c55e]/30'
                : 'bg-white text-[#4a554e] border border-[#d5ded8] hover:border-[#143e2b]/40'
            }`}
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#143e2b]" />
            ) : (
              <MapPin className="w-4 h-4 text-[#143e2b]" />
            )}
            <span className="hidden sm:inline">
              {permissionStatus === 'granted' ? 'Location Detected' : 'Use My Location'}
            </span>
          </button>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[#d5ded8] text-xs font-bold text-[#143e2b] hover:bg-[#ebf5ed] transition-colors relative cursor-pointer shadow-2xs"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#143e2b]" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#143e2b] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Location status notifications */}
        {locationError && permissionStatus === 'denied' && (
          <div className="max-w-7xl mx-auto mt-3">
            <p className="text-xs text-amber-800 bg-amber-50/90 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-200/80 font-bold">
              {locationError}
            </p>
          </div>
        )}
        {userLocation && (
          <div className="max-w-7xl mx-auto mt-3">
            <p className="text-xs text-[#143e2b] bg-[#ebf5ed]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#22c55e]/30 font-bold flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
              <span>Location set to <strong>{userLocation.address}, {userLocation.city}</strong></span>
            </p>
          </div>
        )}

        {/* Waste Category Filter Chips */}
        <div className="max-w-7xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {wasteTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilters(prev => ({ ...prev, wasteType: type }))}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filters.wasteType === type
                  ? 'bg-[#143e2b] text-white shadow-xs'
                  : 'bg-white/80 border border-[#eaeae4] text-[#4a554e] hover:bg-[#ebf5ed]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-80 border-r border-[#eaeae4] bg-white/80 backdrop-blur-xl overflow-y-auto shrink-0 shadow-xs">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            activeCount={activeFiltersCount}
          />
        </div>

        {/* Center List Column */}
        <div className={`w-full lg:w-[460px] bg-ambient-light overflow-y-auto border-r border-[#eaeae4] shrink-0 ${
          mobileSheetExpanded ? 'block' : 'hidden lg:block'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#eaeae4]">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b]">
                {loading ? 'Searching...' : `${centers.length} Centers Found`}
              </h2>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as ExploreFilters['sortBy'] }))}
                className="text-xs font-bold border border-[#d5ded8] rounded-xl px-3 py-2 bg-white/90 text-[#143e2b] focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 shadow-2xs cursor-pointer"
                aria-label="Sort centers"
              >
                <option value="nearest">Nearest First</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="most_popular">Most Popular</option>
              </select>
            </div>

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <CenterCardSkeleton key={i} />)}
              </div>
            )}

            {error && <ErrorState message={error} onRetry={fetchCenters} />}

            {!loading && !error && centers.length === 0 && (
              <EmptyState
                title="No centers found"
                description="No recycling centers match your criteria. Try adjusting your distance or category filters."
                actionLabel="Reset Filters"
                onAction={resetFilters}
              />
            )}

            {!loading && !error && centers.length > 0 && (
              <div className="space-y-4">
                {centers.map((center, i) => (
                  <div
                    key={center.id}
                    onClick={() => setSelectedCenter(center.id)}
                    className={`cursor-pointer rounded-3xl transition-all ${
                      selectedCenter === center.id ? 'ring-2 ring-[#22c55e] ring-offset-2' : ''
                    }`}
                  >
                    <CenterCard center={center} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Container Column */}
        <div className={`flex-1 relative ${mobileSheetExpanded ? 'hidden lg:block' : 'block'}`}>
          <ExploreMap
            centers={centers}
            selectedCenter={selectedCenterData}
            userLocation={userLocation}
            onSelectCenter={setSelectedCenter}
          />

          {/* Mobile Sheet Toggle */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20">
            <div className="bg-white/95 backdrop-blur-2xl rounded-t-3xl shadow-2xl border-t border-[#eaeae4]">
              <button
                onClick={() => setMobileSheetExpanded(p => !p)}
                className="w-full flex flex-col items-center py-3.5 cursor-pointer"
              >
                <div className="w-12 h-1.5 rounded-full bg-stone-300 mb-2" />
                <p className="text-xs font-bold text-[#143e2b]">
                  {mobileSheetExpanded ? 'Show Interactive Map' : `${centers.length} Centers Found • Tap to expand`}
                </p>
              </button>
              {!mobileSheetExpanded && centers.length > 0 && (
                <div className="px-5 pb-5 max-h-56 overflow-y-auto space-y-3">
                  {centers.slice(0, 3).map(center => (
                    <div
                      key={center.id}
                      onClick={() => setSelectedCenter(center.id)}
                      className="cursor-pointer"
                    >
                      <CenterCard center={center} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#070e0b]/60 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-84 max-w-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#eaeae4]">
                <h3 className="font-extrabold text-[#143e2b] text-base font-display">Filter Discovery</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1.5 text-[#556358] hover:text-[#143e2b]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => { resetFilters(); setShowMobileFilters(false); }}
                activeCount={activeFiltersCount}
              />
              <div className="p-5 border-t border-[#eaeae4] bg-[#f7f9f7]">
                <Button onClick={() => setShowMobileFilters(false)} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

