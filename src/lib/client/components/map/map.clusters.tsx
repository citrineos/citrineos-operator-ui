// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { LocationDto } from '@citrineos/base';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MarkerClusterer, type Marker } from '@googlemaps/markerclusterer';
import { LocationIcon } from '@lib/client/components/map/marker.icons';
import { MapMarkerV2 } from '@lib/client/components/map/map.clusters.marker';

/**
 * Reference: https://github.com/visgl/react-google-maps/blob/main/examples/marker-clustering/src/clustered-tree-markers.tsx
 */
export const ClusteredLocationMarkers = ({
  locations,
}: {
  locations: LocationDto[];
}) => {
  const [markers, setMarkers] = useState<{ [id: number]: Marker }>({});
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );

  const selectedLocation = useMemo(
    () =>
      locations && selectedLocationId
        ? locations.find((t) => t.id === selectedLocationId)!
        : null,
    [locations, selectedLocationId],
  );

  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: Marker | null, id: number) => {
    setMarkers((markers) => {
      if ((marker && markers[id]) || (!marker && !markers[id])) return markers;

      if (marker) {
        return { ...markers, [id]: marker };
      } else {
        const { [id]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocationId(null);
  }, []);

  const handleMarkerClick = useCallback((location: LocationDto) => {
    setSelectedLocationId(location.id!);
  }, []);

  return (
    <>
      {locations.map((location) => (
        <MapMarkerV2
          key={location.id}
          location={location}
          onClickAction={handleMarkerClick}
          setMarkerRefAction={setMarkerRef}
        />
      ))}

      {selectedLocationId && (
        <InfoWindow
          anchor={markers[selectedLocationId]}
          onCloseClick={handleInfoWindowClose}
        >
          {selectedLocation?.name}
        </InfoWindow>
      )}
    </>
  );
};
