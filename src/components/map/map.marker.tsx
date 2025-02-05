import React, { MouseEventHandler } from 'react';
import { MarkerIcon } from './marker.icon';

export interface MarkerProps {
  lat: number;
  lng: number;
  identifier: string;
  content?: React.ReactNode;
  onClick?: MouseEventHandler<any> | undefined;
  isSelected?: boolean;
  zoom?: number;
  color?: string;
}

export const MapMarker: React.FC<MarkerProps> = ({
  identifier: _identifier,
  content,
  onClick,
  isSelected,
  zoom = 10,
  color = 'red',
}) => {
  // Adjust marker size based on zoom level - larger when zoomed in, smaller when zoomed out
  const baseSize = 30; // Base size for the marker
  const markerSize = baseSize * (zoom / 10); // Adjust size based on zoom

  return (
    <div
      onClick={onClick}
      style={{
        color,
        cursor: 'pointer',
        position: 'absolute',
        transform: `translate(-50%, -100%)`, // Adjust for anchor offset
        textAlign: 'center',
      }}
    >
      <MarkerIcon
        style={{
          width: `${markerSize}px`,
          height: `${markerSize}px`,
        }}
        fillColor={isSelected ? 'purple' : color}
      />
      {content && <div className="map-marker-content">{content}</div>}
    </div>
  );
};
