import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoriteApi } from '../api/favoriteApi';
import type { Favorite } from '../types';
import CenterCard from '../components/center/CenterCard';
import { CenterCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchFavorites = () => {
    setLoading(true);
    favoriteApi.getFavorites()
      .then(setFavorites)
      .catch(() => setError('Unable to load favorites.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <div className="py-24 sm:py-32 lg:py-40 min-h-screen bg-ambient-light">
      <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-6 mb-16 pb-10 border-b border-[#eaeae4]">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-md">
            <Heart className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#143e2b] block mb-1">SAVED LOCATIONS</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#1b251f] tracking-tight">My Favorites</h1>
            <p className="text-base font-medium text-[#556358] mt-1">{favorites.length} saved drop-off centers</p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {Array.from({ length: 3 }).map((_, i) => <CenterCardSkeleton key={i} />)}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={fetchFavorites} />}

        {!loading && !error && favorites.length === 0 && (
          <EmptyState
            icon={<Heart className="w-12 h-12 text-rose-500" />}
            title="No favorites saved yet"
            description="Explore verified drop-off centers and save your frequently visited locations for quick access."
            actionLabel="Explore Centers"
            onAction={() => navigate('/explore')}
          />
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {favorites.map((fav, i) => (
              <CenterCard key={fav.id} center={fav.center} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


