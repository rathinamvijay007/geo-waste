import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserLocation, LocationPermissionStatus } from '../types';
import { locationApi } from '../api/locationApi';

interface LocationContextType {
  userLocation: UserLocation | null;
  permissionStatus: LocationPermissionStatus;
  isDetecting: boolean;
  detectLocation: () => Promise<void>;
  clearLocation: () => void;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('prompt');
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    setError(null);
    setPermissionStatus('loading');
    try {
      const position = await locationApi.detectUserLocation();
      const { latitude, longitude } = position.coords;

      // Reverse geocode
      const locationData = await locationApi.reverseGeocode(latitude, longitude);
      setUserLocation(locationData);
      setPermissionStatus('granted');

      // Post to backend (fire and forget)
      locationApi.postLocation(latitude, longitude).catch(() => {});
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setPermissionStatus('denied');
            setError('Location access denied. Search manually by city or area.');
            break;
          case err.POSITION_UNAVAILABLE:
            setPermissionStatus('error');
            setError('Location unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setPermissionStatus('error');
            setError('Location request timed out. Please try again.');
            break;
        }
      } else {
        setPermissionStatus('error');
        setError('Unable to detect location. Search manually.');
      }
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setPermissionStatus('prompt');
    setError(null);
  }, []);

  return (
    <LocationContext.Provider value={{ userLocation, permissionStatus, isDetecting, detectLocation, clearLocation, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
}
