import React, { MouseEventHandler, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import './style.scss';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

export interface MapProps {
  markers?: MarkerProps[];
  defaultCenter?: { lat: number; lng: number };
  zoom?: number;
}

const MapMarker: React.FC<MarkerProps> = ({
  identifier: _identifier,
  content,
  onClick,
  isSelected,
  zoom = 10,
  color = 'red',
}) => {
  const markerIcon = isSelected ? '/selected.png' : '/online.png';

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
      <img
        src={markerIcon}
        alt="marker"
        style={{
          width: `${markerSize}px`,
          height: `${(markerSize * 153) / 116}px`,
        }} // Maintain aspect ratio
      />
      {content && <div className="map-marker-content">{content}</div>}
    </div>
  );
};

/**
 * The GoogleMapContainer component is a reusable React component that integrates with the Google Maps API
 * to display a map with customizable markers. Each marker can be clicked to pan and zoom into the location,
 * and the map dynamically adjusts based on user interactions.
 *
 * Props:
 * - markers (MarkerProps[]): An array of marker objects representing the locations to be displayed on the map.
 *   Each MarkerProps object includes:
 *   - lat (number): Latitude of the marker.
 *   - lng (number): Longitude of the marker.
 *   - identifier (string): Unique identifier for the marker.
 *   - content (React.ReactNode): Optional content to display when the marker is clicked.
 *   - onClick ((identifier: string) => void): Optional click handler for the marker.
 *   - isSelected (boolean): Indicates whether the marker is selected.
 *   - zoom (number): The current zoom level of the map.
 *
 * - defaultCenter ({ lat: number; lng: number }): The initial center of the map. Default: { lat: 0, lng: 0 }.
 * - zoom (number): The initial zoom level of the map. Default: 11.
 *
 * Functionality:
 * - Marker Size Adjustment: The size of each marker adjusts dynamically based on the map's zoom level.
 *   Markers grow larger as the user zooms in and shrink as the user zooms out.
 * - Click Handling: When a marker is clicked, the map pans to center on the marker and zooms in by 3 levels
 *   (up to a maximum zoom level of 20). The selected marker's content (if provided) is displayed above the marker.
 * - Automatic Map Bounds: On initial load, the map automatically adjusts its bounds to include all markers within view.
 * - Responsive Marker Icons: Markers use two different icons based on their selection state:
 *   - selected.png for selected markers.
 *   - online.png for non-selected markers.
 *   These icons are expected to be located in the /public directory.
 * - Zoom Level Tracking: The component tracks the current zoom level and adjusts marker sizes accordingly.
 *   The zoom level updates dynamically as the user interacts with the map.
 */
export const GoogleMapContainer: React.FC<MapProps> = ({
  markers = [],
  defaultCenter = { lat: 0, lng: 0 },
  zoom = 11,
}) => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);

  const handleMarkerClick = (identifier: string, lat: number, lng: number) => {
    const newActiveMarker = activeMarker === identifier ? null : identifier;
    if (mapInstance && newActiveMarker) {
      mapInstance.panTo({ lat, lng });

      // Zoom in on the marker
      const newZoom = Math.min(currentZoom + 3, 10); // Zoom in by 3 levels, with a max of 20
      mapInstance.setZoom(newZoom);
      setCurrentZoom(newZoom);

      setActiveMarker((prev) => (prev === identifier ? null : identifier));
    }
  };

  const handleApiLoaded = (map: google.maps.Map, maps: typeof google.maps) => {
    setMapInstance(map);

    try {
      const bounds = new maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(new maps.LatLng(marker.lat, marker.lng));
      });
      map.fitBounds(bounds);
      map.setZoom(zoom);
    } catch (error) {
      console.error('Error creating bounds or fitting map:', error);
    }
  };

  if (!markers || markers.length === 0) {
    markers = [
      {
        lat: defaultCenter.lat,
        lng: defaultCenter.lng,
        identifier: 'default',
        content: null,
        onClick: () => {},
        isSelected: true,
        zoom,
        color: 'red',
      },
    ];
  }

  return (
    <div className="map-wrapper">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultCenter}
        defaultZoom={zoom}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {markers.map((marker) => (
          <MapMarker
            color={marker.color}
            key={marker.identifier}
            lat={marker.lat}
            lng={marker.lng}
            identifier={marker.identifier}
            content={activeMarker === marker.identifier ? marker.content : null}
            onClick={() =>
              handleMarkerClick(marker.identifier, marker.lat, marker.lng)
            }
            isSelected={activeMarker === marker.identifier}
            zoom={currentZoom} // Pass the current zoom level
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};
