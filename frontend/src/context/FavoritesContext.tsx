import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { favoriteApi } from '../api/favoriteApi';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  isLoading: boolean;
  toggleFavorite: (centerId: string) => Promise<void>;
  isFavorite: (centerId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      favoriteApi.getFavorites()
        .then(favs => setFavoriteIds(new Set(favs.map(f => f.centerId))))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setFavoriteIds(new Set());
    }
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (centerId: string) => {
    const isFav = favoriteIds.has(centerId);
    // Optimistic update
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(centerId);
      else next.add(centerId);
      return next;
    });

    try {
      if (isFav) {
        await favoriteApi.removeFavorite(centerId);
      } else {
        await favoriteApi.addFavorite(centerId);
      }
    } catch {
      // Rollback on error
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isFav) next.add(centerId);
        else next.delete(centerId);
        return next;
      });
    }
  }, [favoriteIds]);

  const isFavorite = useCallback((centerId: string) => favoriteIds.has(centerId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
