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
    <div className="pt-24 pb-32 min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-surface-200/80">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">My Favorites</h1>
            <p className="text-sm font-medium text-surface-500 mt-1">{favorites.length} saved drop-off centers</p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => <CenterCardSkeleton key={i} />)}
          </div>
        )}

        {error && <ErrorState message={error} onRetry={fetchFavorites} />}

        {!loading && !error && favorites.length === 0 && (
          <EmptyState
            icon={<Heart className="w-10 h-10 text-surface-400" />}
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
