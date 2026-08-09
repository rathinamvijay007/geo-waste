import { RotateCcw, Star } from 'lucide-react';
import type { ExploreFilters } from '../../types';

interface FilterPanelProps {
  filters: ExploreFilters;
  onChange: (filters: ExploreFilters) => void;
  onReset: () => void;
  activeCount: number;
}

const wasteTypes = ['E-Waste', 'Battery', 'Plastic', 'Electronics', 'Other'];
const distances = [
  { label: '1 km', value: 1 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 },
  { label: 'Any', value: 50 },
];

export default function FilterPanel({ filters, onChange, onReset, activeCount }: FilterPanelProps) {
  const update = (partial: Partial<ExploreFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-200/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-surface-800">
          Filters {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-eco-100 text-eco-800 text-[10px]">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-eco-700 hover:text-eco-900 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Waste Type */}
      <div>
        <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Waste Category</h4>
        <div className="space-y-2">
          {wasteTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group py-0.5">
              <input
                type="checkbox"
                checked={filters.wasteType === type}
                onChange={() => update({ wasteType: filters.wasteType === type ? 'All' : type })}
                className="w-4 h-4 rounded border-surface-300 text-eco-700 focus:ring-eco-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-surface-700 group-hover:text-surface-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Distance Radius</h4>
        <div className="flex flex-wrap gap-1.5">
          {distances.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => update({ distance: d.value })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filters.distance === d.value
                  ? 'bg-eco-800 text-white shadow-2xs font-semibold'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200/80'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Rating</h4>
        <div className="space-y-2">
          {[
            { label: '4+ Stars', value: 4 },
            { label: '3+ Stars', value: 3 },
            { label: 'Any Rating', value: 0 },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-0.5">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === opt.value}
                onChange={() => update({ rating: opt.value })}
                className="w-4 h-4 border-surface-300 text-eco-700 focus:ring-eco-600 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-sm font-medium text-surface-700 group-hover:text-surface-900">
                {opt.value > 0 && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2 border-t border-surface-200/80">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-sm font-medium text-surface-800">Verified Centers Only</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            onClick={() => update({ verifiedOnly: !filters.verifiedOnly })}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.verifiedOnly ? 'bg-eco-700' : 'bg-surface-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-2xs transition-transform ${filters.verifiedOnly ? 'translate-x-5' : ''}`} />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-sm font-medium text-surface-800">Open Now</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.openNow}
            onClick={() => update({ openNow: !filters.openNow })}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.openNow ? 'bg-eco-700' : 'bg-surface-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-2xs transition-transform ${filters.openNow ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      {/* Sort */}
      <div className="pt-2 border-t border-surface-200/80">
        <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Sort Results</h4>
        <div className="space-y-2">
          {[
            { label: 'Nearest First', value: 'nearest' as const },
            { label: 'Highest Rated', value: 'highest_rated' as const },
            { label: 'Most Popular', value: 'most_popular' as const },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-0.5">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === opt.value}
                onChange={() => update({ sortBy: opt.value })}
                className="w-4 h-4 border-surface-300 text-eco-700 focus:ring-eco-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-surface-700 group-hover:text-surface-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
