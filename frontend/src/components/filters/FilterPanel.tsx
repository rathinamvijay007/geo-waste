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

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  activeCount,
}: FilterPanelProps) {
  const update = (partial: Partial<ExploreFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="p-8 space-y-9 bg-[#0d1611]/90 backdrop-blur-xl h-full text-[#edf7ee]">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#4ade80] flex items-center gap-2 font-mono">
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#4ade80] text-[#052e16] text-[10px] font-extrabold">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Waste Category */}
      <div>
        <h4 className="text-xs font-mono font-bold text-[#edf7ee]/50 uppercase tracking-wider mb-4">
          Waste Category
        </h4>
        <div className="space-y-2.5">
          {wasteTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group py-1.5"
            >
              <input
                type="checkbox"
                checked={filters.wasteType === type}
                onChange={() =>
                  update({ wasteType: filters.wasteType === type ? 'All' : type })
                }
                className="w-4 h-4 rounded border-white/20 text-[#4ade80] focus:ring-[#4ade80] cursor-pointer accent-[#22c55e]"
              />
              <span className="text-sm font-semibold text-[#edf7ee]/80 group-hover:text-[#4ade80] transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="text-xs font-mono font-bold text-[#edf7ee]/50 uppercase tracking-wider mb-4">
          Distance Radius
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {distances.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => update({ distance: d.value })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filters.distance === d.value
                  ? 'bg-[#22c55e] text-[#052e16] shadow-md shadow-[#22c55e]/20 font-extrabold'
                  : 'bg-white/5 border border-white/10 text-[#edf7ee]/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-mono font-bold text-[#edf7ee]/50 uppercase tracking-wider mb-4">
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[
            { label: '4+ Stars', value: 4 },
            { label: '3+ Stars', value: 3 },
            { label: 'Any Rating', value: 0 },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group py-1.5"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === opt.value}
                onChange={() => update({ rating: opt.value })}
                className="w-4 h-4 border-white/20 text-[#4ade80] focus:ring-[#4ade80] cursor-pointer accent-[#22c55e]"
              />
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[#edf7ee]/80 group-hover:text-[#4ade80]">
                {opt.value > 0 && (
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                )}
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <label className="flex items-center justify-between cursor-pointer py-1.5">
          <span className="text-sm font-semibold text-[#edf7ee]/80">
            Verified Centers Only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            onClick={() => update({ verifiedOnly: !filters.verifiedOnly })}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              filters.verifiedOnly ? 'bg-[#22c55e]' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#052e16] rounded-full shadow-xs transition-transform ${
                filters.verifiedOnly ? 'translate-x-5 bg-white' : ''
              }`}
            />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1.5">
          <span className="text-sm font-semibold text-[#edf7ee]/80">
            Open Now
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.openNow}
            onClick={() => update({ openNow: !filters.openNow })}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              filters.openNow ? 'bg-[#22c55e]' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#052e16] rounded-full shadow-xs transition-transform ${
                filters.openNow ? 'translate-x-5 bg-white' : ''
              }`}
            />
          </button>
        </label>
      </div>

      {/* Sort */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-xs font-mono font-bold text-[#edf7ee]/50 uppercase tracking-wider mb-4">
          Sort Results
        </h4>
        <div className="space-y-2">
          {[
            { label: 'Nearest First', value: 'nearest' as const },
            { label: 'Highest Rated', value: 'highest_rated' as const },
            { label: 'Most Popular', value: 'most_popular' as const },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group py-1.5"
            >
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === opt.value}
                onChange={() => update({ sortBy: opt.value })}
                className="w-4 h-4 border-white/20 text-[#4ade80] focus:ring-[#4ade80] cursor-pointer accent-[#22c55e]"
              />
              <span className="text-sm font-semibold text-[#edf7ee]/80 group-hover:text-[#4ade80]">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
