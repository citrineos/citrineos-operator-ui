// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { LocationDto } from '@citrineos/base';
import { LocationMap } from '@lib/client/components/map/map';
import { Input } from '@lib/client/components/ui/input';
import { LocationClass } from '@lib/cls/location.dto';
import { LOCATIONS_LIST_QUERY } from '@lib/queries/locations';
import { ResourceType } from '@lib/utils/access.types';
import { useList } from '@refinedev/core';
import { plainToInstance } from 'class-transformer';
import React, { useMemo, useState } from 'react';

export interface LocationsMapProps {
  mapOnly?: boolean;
}

export const LocationsMap: React.FC<LocationsMapProps> = ({
  mapOnly = false,
}: LocationsMapProps) => {
  const [filteredLocations, setFilteredLocations] = useState<LocationDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >();

  const {
    query: { data },
  } = useList<LocationClass>({
    resource: ResourceType.LOCATIONS,
    sorters: [
      {
        field: 'updatedAt',
        order: 'desc',
      },
    ],
    meta: {
      gqlQuery: LOCATIONS_LIST_QUERY,
    },
    queryOptions: {
      select: (data) => ({
        ...data,
        data: data.data.map((item) => plainToInstance(LocationClass, item)),
      }),
    },
  });

  const allLocations = data?.data || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    const filtered = allLocations.filter(
      (value) =>
        value.chargingPool?.some((station) =>
          station.id.includes(lowerCaseQuery),
        ) ||
        value.address?.toLowerCase().includes(lowerCaseQuery) ||
        value.name?.toLowerCase().includes(lowerCaseQuery),
    );

    setFilteredLocations(filtered);
  };

  // Process locations for rendering
  const locationsForMap = useMemo(() => {
    const locationsData =
      searchQuery.length > 0 ? filteredLocations : allLocations;

    // Enhance locations with custom react content for markers
    return locationsData.map((location) => {
      // Create a copy of the location with the custom React content
      const enhancedLocation = { ...location };

      // Add react content to the location's charging stations if needed
      enhancedLocation.chargingPool = enhancedLocation.chargingPool?.map(
        (station) => ({
          ...station,
          reactContent: null, // If you need custom content for station markers
        }),
      );

      return enhancedLocation;
    });
  }, [allLocations, filteredLocations, searchQuery]);

  // Handle marker click
  const handleMarkerClick = (
    id: string,
    type: 'station' | 'location' | 'mixed',
  ) => {
    console.debug(`Marker ${id} clicked, type: ${type}`);

    if (type === 'location') {
      // Navigate to location detail page when a location marker is clicked
      window.location.href = `/locations/${id}`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {!mapOnly && (
        <div className="header-row flex justify-between p-4">
          <Input
            placeholder="Search for a location"
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>
      )}
      <div className="flex-1">
        <div className="w-full h-full">
          <LocationMap
            locations={locationsForMap}
            defaultCenter={{ lat: 36.7783, lng: -119.4179 }}
            zoom={6}
            onMarkerClick={handleMarkerClick}
            selectedMarkerId={selectedLocationId}
            clusterByLocation={true}
          />
        </div>
      </div>
    </div>
  );
};
