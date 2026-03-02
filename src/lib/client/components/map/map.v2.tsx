// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { APIProvider, ColorScheme, Map } from '@vis.gl/react-google-maps';
import config from '@lib/utils/config';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGoogleMapsApiKey,
  setGoogleMapsApiKey,
} from '@lib/utils/store/maps.slice';
import { getGoogleMapsApiKeyAction } from '@lib/server/actions/map/getGoogleMapsApiKeyAction';
import type { LocationDto } from '@citrineos/base';
import { ClusteredLocationMarkers } from '@lib/client/components/map/map.clusters';
import { Skeleton } from '@lib/client/components/ui/skeleton';
import { useTheme } from 'next-themes';

const defaultCenter = {
  lat: config.defaultMapCenterLatitude!,
  lng: config.defaultMapCenterLongitude!,
};

export const LocationMapV2 = ({ locations }: { locations: LocationDto[] }) => {
  const dispatch = useDispatch();
  const apiKey = useSelector(getGoogleMapsApiKey);

  const { theme } = useTheme();

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
          defaultCenter={defaultCenter}
          gestureHandling="cooperative"
          disableDefaultUI
          zoomControl
          colorScheme={theme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT}
        >
          <ClusteredLocationMarkers
            locations={locations.filter((location) => location.coordinates)}
          />
        </Map>
      </APIProvider>
    </div>
  );
};
