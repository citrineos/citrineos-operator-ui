// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AutoComplete, Input, Row } from 'antd';
import React, { useState, useMemo } from 'react';
import { LocationDto } from '../../../dtos/location.dto';
import { LocationMarker } from './location-marker';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '@util/auth';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { LOCATIONS_LIST_QUERY } from '../queries';
import { plainToInstance } from 'class-transformer';
import './style.scss';
// Import the new LocationMap component instead of GoogleMapWithMarkers
import { LocationMap } from '../../../components/map/map';

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

  const { tableProps } = useTable<LocationDto>({
    resource: ResourceType.LOCATIONS,
    sorters: DEFAULT_SORTERS,
    meta: {
      gqlQuery: LOCATIONS_LIST_QUERY,
    },
    queryOptions: {
      select: (data) => ({
        ...data,
        data: data.data.map((item) => plainToInstance(LocationDto, item)),
      }),
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    const filtered =
      (tableProps.dataSource as unknown as LocationDto[])?.filter(
        (location: LocationDto) =>
          location.chargingStations?.some((station) =>
            station.id.includes(lowerCaseQuery),
          ) ||
          location.address?.toLowerCase().includes(lowerCaseQuery) ||
          location.name?.toLowerCase().includes(lowerCaseQuery),
      ) || [];

    setFilteredLocations(filtered);
  };

  // Process locations for rendering
  const locationsForMap = useMemo(() => {
    const locationsData =
      (searchQuery.length > 0
        ? filteredLocations
        : (tableProps.dataSource as unknown as LocationDto[])) || [];

    // Enhance locations with custom react content for markers
    return locationsData.map((location) => {
      // Create a copy of the location with the custom React content
      const enhancedLocation = { ...location };

      // Add react content to the location's charging stations if needed
      enhancedLocation.chargingStations = enhancedLocation.chargingStations.map(
        (station) => ({
          ...station,
          reactContent: null, // If you need custom content for station markers
        }),
      );

      return enhancedLocation;
    });
  }, [tableProps.dataSource, filteredLocations, searchQuery]);

  // Handle marker click
  const handleMarkerClick = (
    id: string,
    type: 'station' | 'location' | 'mixed',
  ) => {
    console.debug(`Marker ${id} clicked, type: ${type}`);
    setSelectedLocationId(id);

    if (type === 'location') {
      // Navigate to location detail page when a location marker is clicked
      window.location.href = `/locations/${id}`;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!mapOnly && (
        <Row
          justify="space-between"
          className="header-row"
          style={{ padding: '0px 16px' }}
        >
          {/* <h2>Locations</h2> */}
          <AutoComplete
            options={filteredLocations.map((location) => ({
              // Use the display name as the value to show in the input
              value: `${location.name} - ${location.address}`,
              // Store the actual data in a custom property
              data: location,
            }))}
            allowClear
            value={searchQuery}
            onSearch={handleSearch}
            onChange={setSearchQuery}
            onSelect={(value, option) => {
              // Access the location through the option's data property
              if (option && option.data) {
                window.location.href = `/locations/${option.data.id}`;
              }
            }}
            filterOption={(inputValue, option) =>
              option!.value
                .toString()
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            }
          >
            <Input placeholder="Search for a location" />
          </AutoComplete>
        </Row>
      )}
      <Row style={{ flex: '1 1 auto' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <LocationMap
            locations={locationsForMap}
            defaultCenter={{ lat: 36.7783, lng: -119.4179 }}
            zoom={6}
            onMarkerClick={handleMarkerClick}
            selectedMarkerId={selectedLocationId}
            clusterByLocation={true}
          />
        </div>
      </Row>
    </div>
  );
};
