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

export default function CenterCard({ center, index = 0, compact = false }: CenterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-[#e5ebe7] p-7 shadow-sm hover:shadow-xl hover:border-[#22c55e]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full space-y-5 overflow-hidden"
    >
      {/* Subtle Top Ambient Gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf5ed] border border-[#22c55e]/20 text-xs font-bold text-[#143e2b]">
            <Check className="w-3.5 h-3.5 text-[#143e2b]" />
            <span>Verified Center</span>
          </div>
          <FavoriteButton centerId={center.id} size="sm" />
        </div>

        <div>
          <h3 className="text-xl font-bold font-display text-[#1b251f] tracking-tight group-hover:text-[#143e2b] transition-colors leading-snug">
            {center.name}
          </h3>
          <p className="text-xs text-[#556358] flex items-center gap-1 mt-1 font-normal">
            <MapPin className="w-3.5 h-3.5 text-[#788a7e] shrink-0" />
            <span className="truncate">{center.address}, {center.city}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#4a554e] font-semibold pt-1 border-t border-[#f0f4f1]">
          {center.distance !== undefined && (
            <>
              <span className="bg-stone-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#143e2b]">{center.distance} km away</span>
              <span className="text-stone-300">•</span>
            </>
          )}
          <span className="flex items-center gap-1 text-[#1b251f]">
            <Star className="w-3.5 h-3.5 fill-[#143e2b] text-[#143e2b]" /> 
            <span className="font-bold">{center.rating}</span> 
            <span className="text-[#788a7e] font-normal">({center.reviewCount} reviews)</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs pt-0.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${center.isOpen ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${center.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </span>
          <span className={`font-semibold ${center.isOpen ? 'text-emerald-700' : 'text-rose-600'}`}>
            {center.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>

        {!compact && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1.5">
              {center.acceptedWaste.slice(0, 3).map(waste => (
                <span key={waste} className="text-[10px] font-semibold text-[#4a554e] bg-stone-100/80 px-2.5 py-1 rounded-md">
                  {waste}
                </span>
              ))}
              {center.acceptedWaste.length > 3 && (
                <span className="text-[10px] font-bold text-[#143e2b] bg-[#ebf5ed] px-2 py-1 rounded-md">
                  +{center.acceptedWaste.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Link
          to={`/center/${center.id}`}
          className="w-full bg-[#ebf5ed] hover:bg-[#143e2b] text-[#143e2b] hover:text-white text-xs font-bold py-3 px-5 rounded-full transition-all duration-300 inline-flex items-center justify-between group/btn shadow-2xs"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

