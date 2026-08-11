import { Link } from 'react-router-dom';
import { Star, Check, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CollectionCenter } from '../../types';
import FavoriteButton from '../favorites/FavoriteButton';

interface CenterCardProps {
  center: CollectionCenter;
  index?: number;
  compact?: boolean;
}

export default function CenterCard({
  center,
  index = 0,
  compact = false,
}: CenterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative liquid-glass-card p-8 sm:p-10 lg:p-12 hover:-translate-y-1.5 hover:border-[#4ade80]/60 transition-all duration-300 flex flex-col justify-between h-full space-y-6 overflow-hidden"
    >
      {/* Subtle Top Ambient Glow Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#4ade80]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/25 text-[11px] font-bold text-[#4ade80]">
            <Check className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>Verified Hub</span>
          </div>
          <FavoriteButton centerId={center.id} size="sm" />
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold font-display text-[#edf7ee] tracking-tight group-hover:text-[#4ade80] transition-colors leading-snug">
            {center.name}
          </h3>
          <p className="text-xs text-[#edf7ee]/60 flex items-center gap-1.5 mt-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
            <span className="truncate">
              {center.address}, {center.city}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#edf7ee]/70 font-semibold pt-3 border-t border-white/10">
          {center.distance !== undefined && (
            <>
              <span className="bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold">
                {center.distance} km away
              </span>
              <span className="text-white/20">•</span>
            </>
          )}
          <span className="flex items-center gap-1.5 text-[#edf7ee]">
            <Star className="w-3.5 h-3.5 fill-[#4ade80] text-[#4ade80]" />
            <span className="font-bold">{center.rating}</span>
            <span className="text-[#edf7ee]/40 font-normal">
              ({center.reviewCount})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs pt-0.5">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                center.isOpen ? 'bg-emerald-400' : 'bg-rose-400'
              } opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                center.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <span
            className={`font-bold text-xs ${
              center.isOpen ? 'text-[#4ade80]' : 'text-rose-400'
            }`}
          >
            {center.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {!compact && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-2">
              {center.acceptedWaste.slice(0, 3).map((waste) => (
                <span
                  key={waste}
                  className="text-[11px] font-semibold text-[#edf7ee]/70 bg-white/5 border border-white/10 px-3 py-1 rounded-lg"
                >
                  {waste}
                </span>
              ))}
              {center.acceptedWaste.length > 3 && (
                <span className="text-[11px] font-bold text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-3 py-1 rounded-lg">
                  +{center.acceptedWaste.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3">
        <Link
          to={`/center/${center.id}`}
          className="w-full bg-[#4ade80]/10 hover:bg-[#22c55e] border border-[#4ade80]/30 text-[#4ade80] hover:text-[#052e16] text-xs font-extrabold py-3.5 px-5 rounded-full transition-all duration-300 inline-flex items-center justify-between group/btn shadow-md"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
