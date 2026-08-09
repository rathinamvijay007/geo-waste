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
    <div className="pt-20 h-screen flex flex-col bg-surface-50">
      {/* Top Controls Bar */}
      <div className="bg-white border-b border-surface-200/80 px-4 sm:px-6 py-3.5 shadow-2xs z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search center name, city, or street..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-900 placeholder:text-surface-400 focus:bg-white focus:ring-2 focus:ring-eco-600/20 focus:border-eco-600 outline-none transition-all"
              aria-label="Search centers"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Button */}
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              permissionStatus === 'granted'
                ? 'bg-eco-50 text-eco-800 border border-eco-200/80'
                : 'bg-surface-100 text-surface-700 border border-surface-200 hover:bg-surface-200/80'
            }`}
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-eco-600" />
            ) : (
              <MapPin className="w-4 h-4 text-eco-700" />
            )}
            <span className="hidden sm:inline">
              {permissionStatus === 'granted' ? 'Location Detected' : 'Use My Location'}
            </span>
          </button>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-100 border border-surface-200 text-xs font-semibold text-surface-700 hover:bg-surface-200 transition-colors relative cursor-pointer"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4 text-surface-600" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-eco-700 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Location status notifications */}
        {locationError && permissionStatus === 'denied' && (
          <div className="max-w-7xl mx-auto mt-2.5">
            <p className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60 font-medium">
              {locationError}
            </p>
          </div>
        )}
        {userLocation && (
          <div className="max-w-7xl mx-auto mt-2.5">
            <p className="text-xs text-eco-800 bg-eco-50 px-3 py-1.5 rounded-lg border border-eco-200/60 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-eco-600 shrink-0" />
              <span>Location set to <strong className="font-semibold">{userLocation.address}, {userLocation.city}</strong></span>
            </p>
          </div>
        )}

        {/* Waste Category Filter Chips */}
        <div className="max-w-7xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {wasteTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilters(prev => ({ ...prev, wasteType: type }))}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filters.wasteType === type
                  ? 'bg-eco-800 text-white shadow-2xs'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200/80'
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
        <div className="hidden lg:block w-72 border-r border-surface-200/80 bg-white overflow-y-auto shrink-0">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            activeCount={activeFiltersCount}
          />
        </div>

        {/* Center List Column */}
        <div className={`w-full lg:w-[420px] bg-surface-50 overflow-y-auto border-r border-surface-200/80 shrink-0 ${
          mobileSheetExpanded ? 'block' : 'hidden lg:block'
        }`}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-200/60">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-700">
                {loading ? 'Searching...' : `${centers.length} Centers Found`}
              </h2>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as ExploreFilters['sortBy'] }))}
                className="text-xs font-semibold border border-surface-200 rounded-xl px-2.5 py-1.5 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-eco-600/20 shadow-2xs"
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
                    className={`cursor-pointer rounded-2xl transition-all ${
                      selectedCenter === center.id ? 'ring-2 ring-eco-600 ring-offset-2' : ''
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
            <div className="bg-white rounded-t-2xl shadow-xl border-t border-surface-200/80">
              <button
                onClick={() => setMobileSheetExpanded(p => !p)}
                className="w-full flex flex-col items-center py-3 cursor-pointer"
              >
                <div className="w-10 h-1.5 rounded-full bg-surface-300 mb-1.5" />
                <p className="text-xs font-bold text-surface-700">
                  {mobileSheetExpanded ? 'Show Interactive Map' : `${centers.length} Centers Found • Tap to expand`}
                </p>
              </button>
              {!mobileSheetExpanded && centers.length > 0 && (
                <div className="px-4 pb-4 max-h-52 overflow-y-auto space-y-2">
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
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-surface-200">
                <h3 className="font-bold text-surface-900 text-sm">Filter Discovery</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-surface-400 hover:text-surface-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => { resetFilters(); setShowMobileFilters(false); }}
                activeCount={activeFiltersCount}
              />
              <div className="p-4 border-t border-surface-200 bg-surface-50">
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
