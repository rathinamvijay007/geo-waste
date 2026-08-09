import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  centerId: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function FavoriteButton({ centerId, size = 'md', className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isFav = isFavorite(centerId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(centerId);
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={handleClick}
      className={`${btnSize} rounded-full transition-all duration-200 ${
        isFav
          ? 'text-red-500 bg-red-50 hover:bg-red-100'
          : 'text-surface-400 bg-surface-100 hover:bg-surface-200 hover:text-surface-600'
      } ${className}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`${iconSize} ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}
