import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { MapMarker } from './map.marker';
import { GeoPoint } from '@util/GeoPoint';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface LocationPickerMapProps {
  point?: GeoPoint;
  defaultCenter?: { lat: number; lng: number };
  zoom?: number;
  onLocationSelect: (point: GeoPoint) => void;
}

export const MapLocationPicker: React.FC<LocationPickerMapProps> = ({
  point,
  defaultCenter = { lat: 36.7783, lng: -119.4179 },
  zoom = 10,
  onLocationSelect,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<GeoPoint | null>(
    point !== undefined ? point : null,
  );

  useEffect(() => {
    if (point !== undefined) {
      setSelectedLocation(point);
    }
  }, [point]);

  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }) => {
    const point = new GeoPoint(lat, lng);
    setSelectedLocation(point);
    onLocationSelect(point);
  };

  return (
    <div className="map-wrapper">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultCenter}
        defaultZoom={zoom}
        onClick={handleMapClick}
        yesIWantToUseGoogleMapApiInternals
      >
        {selectedLocation && (
          <MapMarker
            lat={selectedLocation.latitude}
            lng={selectedLocation.longitude}
            key="default"
            identifier="default"
          />
        )}
      </GoogleMapReact>
    </div>
  );
};
