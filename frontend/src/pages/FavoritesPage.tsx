import { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
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
    favoriteApi
      .getFavorites()
      .then(setFavorites)
      .catch(() => setError('Unable to load favorites.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="pt-32 sm:pt-40 pb-40 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-6 mb-16 lg:mb-20 pb-10 border-b border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-lg">
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
          </div>
          <div>
            <div className="eyebrow mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>SAVED LOCATIONS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#edf7ee]">
              My <span className="gradient-text">Favorites</span>
            </h1>
            <p className="text-sm font-medium text-[#edf7ee]/60 mt-1">
              {favorites.length} saved drop-off centers for quick access
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <CenterCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={fetchFavorites} />}

        {!loading && !error && favorites.length === 0 && (
          <EmptyState
            icon={<Heart className="w-12 h-12 text-rose-400" />}
            title="No favorites saved yet"
            description="Explore verified drop-off centers and save your frequently visited locations for quick access."
            actionLabel="Explore Centers"
            onAction={() => navigate('/explore')}
          />
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav, i) => (
              <CenterCard key={fav.id} center={fav.center} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
