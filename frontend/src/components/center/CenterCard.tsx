import { Link } from 'react-router-dom';
import { Star, Check } from 'lucide-react';
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="bg-white rounded-2xl border border-[#eaeae4] p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#143e2b]">
            <Check className="w-4 h-4 text-[#143e2b]" />
            <span>Verified center</span>
          </div>
          <FavoriteButton centerId={center.id} size="sm" />
        </div>

        <h3 className="text-xl font-bold text-[#1b251f] tracking-tight">{center.name}</h3>
        <p className="text-xs text-[#556358]">{center.address}, {center.city}</p>

        <div className="flex items-center gap-2 text-xs text-[#556358] font-medium pt-1">
          {center.distance !== undefined && (
            <>
              <span>{center.distance} km</span>
              <span>•</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#143e2b] text-[#143e2b]" /> {center.rating} ({center.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#556358] pt-1">
          <span className={`w-2 h-2 rounded-full ${center.isOpen ? 'bg-[#143e2b]' : 'bg-rose-500'}`} />
          <span>{center.isOpen ? 'Open now' : 'Closed'}</span>
        </div>

        {!compact && (
          <p className="text-xs text-[#556358] pt-1 font-normal line-clamp-1">
            {center.acceptedWaste.join(' • ')}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Link
          to={`/center/${center.id}`}
          className="inline-block bg-[#ebf5ed] hover:bg-[#d8ebd9] text-[#143e2b] text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
