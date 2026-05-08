'use client';
import { useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EnrichedListing } from '@/lib/types';

interface Props {
  qualifying: EnrichedListing[];
  nonQualifying: EnrichedListing[];
  showAll: boolean;
  onSelect: (listing: EnrichedListing) => void;
  selectedId?: string;
  centerLat?: number;
  centerLng?: number;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

export default function MapView({ qualifying, nonQualifying, showAll, onSelect, selectedId, centerLat, centerLng }: Props) {
  const mapRef = useRef<{ flyTo: (opts: object) => void } | null>(null);

  const onMapLoad = useCallback(() => {
    if (centerLat && centerLng && mapRef.current) {
      mapRef.current.flyTo({ center: [centerLng, centerLat], zoom: 11, duration: 1200 });
    }
  }, [centerLat, centerLng]);

  const markerSize = (equity: number) => {
    const size = Math.min(20, Math.max(8, equity / 10000));
    return size;
  };

  return (
    <Map
      ref={mapRef as React.RefObject<null>}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{ longitude: -96, latitude: 38, zoom: 4 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      onLoad={onMapLoad}
    >
      <NavigationControl position="bottom-right" />

      {showAll && nonQualifying.slice(0, 300).map(listing => (
        <Marker
          key={listing.id}
          longitude={listing.longitude}
          latitude={listing.latitude}
        >
          <div
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B7280', opacity: 0.4, cursor: 'pointer' }}
            onClick={() => onSelect(listing)}
          />
        </Marker>
      ))}

      {qualifying.map(listing => {
        const size = markerSize(listing.yield.equity);
        const isSelected = listing.id === selectedId;
        return (
          <Marker
            key={listing.id}
            longitude={listing.longitude}
            latitude={listing.latitude}
          >
            <div
              onClick={() => onSelect(listing)}
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: listing.yieldColor,
                border: `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.5)'}`,
                cursor: 'pointer',
                boxShadow: isSelected ? `0 0 0 3px ${listing.yieldColor}60` : 'none',
                transform: isSelected ? 'scale(1.4)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}
              title={`${listing.formattedAddress} — ${listing.yield.netYield.toFixed(1)}% net yield`}
            />
          </Marker>
        );
      })}
    </Map>
  );
}
