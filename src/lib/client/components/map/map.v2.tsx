// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import config from '@lib/utils/config';
import { MarkerIconCircle } from '@lib/client/components/map/marker.icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGoogleMapsApiKey,
  setGoogleMapsApiKey,
} from '@lib/utils/maps.slice';
import { getGoogleMapsApiKeyAction } from '@lib/server/actions/map/getGoogleMapsApiKeyAction';
import type { LocationDto } from '@citrineos/base';
import { ClusteredLocationMarkers } from '@lib/client/components/map/map.clusters';
import { Skeleton } from '@lib/client/components/ui/skeleton';

export const LocationMapV2 = ({ locations }: { locations: LocationDto[] }) => {
  const dispatch = useDispatch();
  const apiKey = useSelector(getGoogleMapsApiKey);

  useEffect(() => {
    if (apiKey === undefined) {
      getGoogleMapsApiKeyAction().then((key) =>
        dispatch(setGoogleMapsApiKey(key)),
      );
    }
  }, []);

  return apiKey === undefined ? (
    <Skeleton className="size=full" />
  ) : (
    <div className="size-full">
      <APIProvider apiKey={apiKey ?? ''}>
        <Map
          mapId={config.googleMapsOverviewMapId}
          defaultZoom={4}
          defaultCenter={{ lat: 44.967243, lng: -103.771556 }}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          zoomControl={true}
          fullscreenControl={false}
        >
          <ClusteredLocationMarkers
            locations={locations.filter((location) => location.coordinates)}
          />
        </Map>
      </APIProvider>
    </div>
  );
};
