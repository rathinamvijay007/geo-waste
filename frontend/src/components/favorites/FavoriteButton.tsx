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
          ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
          : 'text-[#edf7ee]/40 bg-white/5 hover:bg-[#4ade80]/10 hover:text-[#4ade80]'
      } ${className}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`${iconSize} ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}
