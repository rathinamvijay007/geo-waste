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
    <div className="p-6 space-y-7 bg-white/70 backdrop-blur-md h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#eaeae4]">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#143e2b] flex items-center gap-2">
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#143e2b] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Waste Category */}
      <div>
        <h4 className="text-[11px] font-bold text-[#556358] uppercase tracking-widest mb-3">Waste Category</h4>
        <div className="space-y-2.5">
          {wasteTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group py-0.5">
              <input
                type="checkbox"
                checked={filters.wasteType === type}
                onChange={() => update({ wasteType: filters.wasteType === type ? 'All' : type })}
                className="w-4 h-4 rounded border-[#d5ded8] text-[#143e2b] focus:ring-[#22c55e] cursor-pointer accent-[#143e2b]"
              />
              <span className="text-xs font-bold text-[#1b251f] group-hover:text-[#143e2b] transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="text-[11px] font-bold text-[#556358] uppercase tracking-widest mb-3">Distance Radius</h4>
        <div className="flex flex-wrap gap-2">
          {distances.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => update({ distance: d.value })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filters.distance === d.value
                  ? 'bg-[#143e2b] text-white shadow-xs'
                  : 'bg-white/80 border border-[#eaeae4] text-[#4a554e] hover:bg-[#ebf5ed]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-[11px] font-bold text-[#556358] uppercase tracking-widest mb-3">Minimum Rating</h4>
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
                className="w-4 h-4 border-[#d5ded8] text-[#143e2b] focus:ring-[#22c55e] cursor-pointer accent-[#143e2b]"
              />
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#1b251f] group-hover:text-[#143e2b]">
                {opt.value > 0 && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3.5 pt-3 border-t border-[#eaeae4]">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-bold text-[#1b251f]">Verified Centers Only</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            onClick={() => update({ verifiedOnly: !filters.verifiedOnly })}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.verifiedOnly ? 'bg-[#143e2b]' : 'bg-stone-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${filters.verifiedOnly ? 'translate-x-5' : ''}`} />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-bold text-[#1b251f]">Open Now</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.openNow}
            onClick={() => update({ openNow: !filters.openNow })}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${filters.openNow ? 'bg-[#143e2b]' : 'bg-stone-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${filters.openNow ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      {/* Sort */}
      <div className="pt-3 border-t border-[#eaeae4]">
        <h4 className="text-[11px] font-bold text-[#556358] uppercase tracking-widest mb-3">Sort Results</h4>
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
                className="w-4 h-4 border-[#d5ded8] text-[#143e2b] focus:ring-[#22c55e] cursor-pointer accent-[#143e2b]"
              />
              <span className="text-xs font-bold text-[#1b251f] group-hover:text-[#143e2b]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

