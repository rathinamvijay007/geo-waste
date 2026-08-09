import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin, Navigation } from 'lucide-react';
import type { CollectionCenter, UserLocation } from '../../types';
import Badge from '../common/Badge';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom center marker
const centerMarkerIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="width:32px;height:32px;background:#059669;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const selectedMarkerIcon = new L.DivIcon({
  className: 'custom-marker-selected',
  html: `<div style="width:40px;height:40px;background:#047857;border:3px solid #ecfdf5;border-radius:50%;box-shadow:0 0 0 4px rgba(5,150,105,0.3),0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userMarkerIcon = new L.DivIcon({
  className: 'user-marker',
  html: `<div style="position:relative;">
    <div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.5);position:relative;z-index:2;"></div>
    <div class="user-location-pulse" style="width:16px;height:16px;background:rgba(59,130,246,0.3);border-radius:50%;position:absolute;top:0;left:0;z-index:1;"></div>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1 });
  }, [center, map]);
  return null;
}

interface ExploreMapProps {
  centers: CollectionCenter[];
  selectedCenter?: CollectionCenter | null;
  userLocation: UserLocation | null;
  onSelectCenter: (id: string) => void;
}

export default function ExploreMap({ centers, selectedCenter, userLocation, onSelectCenter }: ExploreMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const defaultCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [11.0168, 76.9558]; // Coimbatore

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userMarkerIcon}
            >
              <Popup>
                <div className="p-2 text-center">
                  <p className="text-sm font-medium text-surface-800">Your Location</p>
                  {userLocation.address && (
                    <p className="text-xs text-surface-500">{userLocation.address}</p>
                  )}
                </div>
              </Popup>
            </Marker>
            <MapRecenter center={[userLocation.latitude, userLocation.longitude]} />
          </>
        )}

        {centers.map(center => (
          <Marker
            key={center.id}
            position={[center.latitude, center.longitude]}
            icon={selectedCenter?.id === center.id ? selectedMarkerIcon : centerMarkerIcon}
            eventHandlers={{
              click: () => onSelectCenter(center.id),
            }}
          >
            <Popup>
              <div className="p-3 min-w-[220px]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-surface-900">{center.name}</h3>
                  {center.verified && (
                    <Badge variant="verified">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {center.rating} ({center.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {center.distance} km
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {center.acceptedWaste.map(w => (
                    <span key={w} className="px-1.5 py-0.5 text-[10px] bg-surface-100 text-surface-600 rounded-md">{w}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/center/${center.id}`}
                    className="flex-1 text-center text-xs font-medium text-white bg-eco-600 hover:bg-eco-700 rounded-lg py-1.5 transition-colors"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
                    aria-label="Get directions"
                  >
                    <Navigation className="w-4 h-4 text-surface-600" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Recenter button */}
      {userLocation && (
        <button
          onClick={() => mapRef.current?.flyTo([userLocation.latitude, userLocation.longitude], 13)}
          className="absolute bottom-20 lg:bottom-6 right-4 z-10 w-10 h-10 rounded-xl bg-white shadow-lg border border-surface-200 flex items-center justify-center hover:bg-surface-50 transition-colors"
          aria-label="Re-center map"
        >
          <Navigation className="w-4 h-4 text-eco-600" />
        </button>
      )}
    </div>
  );
}
