import { AutoComplete, Input, Row } from 'antd';
import { GoogleMapWithMarkers } from '../../../components/map/map.with.markers';
import React, { useState } from 'react';
import { LocationDto } from '../../../dtos/location.dto';
import { LocationMarker } from './location-marker';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '../../../resource-type';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { LOCATIONS_LIST_QUERY } from '../queries';
import { plainToInstance } from 'class-transformer';
import './style.scss';
import { MarkerProps } from '../../../components/map/map.marker';

export const LocationsMap: React.FC = () => {
  const [filteredLocations, setFilteredLocations] = useState<LocationDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { tableProps } = useTable<LocationDto>({
    resource: ResourceType.LOCATIONS,
    sorters: DEFAULT_SORTERS,
    metaData: {
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
          location.chargingStations.some((station) =>
            station.id.includes(lowerCaseQuery),
          ) ||
          location.address?.toLowerCase().includes(lowerCaseQuery) ||
          location.name?.toLowerCase().includes(lowerCaseQuery),
      ) || [];

    setFilteredLocations(filtered);
  };

  // Dynamically generate markers from the dataSource
  const markers: MarkerProps[] =
    tableProps.dataSource?.map(((location: LocationDto) => {
      const allOnline =
        location.chargingStations.length > 0 &&
        location.chargingStations.every((station) => station.isOnline === true);

      const allOffline = location.chargingStations.every(
        (station) =>
          station.isOnline === false ||
          station.isOnline === null ||
          station.isOnline === undefined,
      );

      return {
        lat: location.coordinates.latitude,
        lng: location.coordinates.longitude,
        identifier: String(location.id),
        content: <LocationMarker location={location} />,
        onClick: ((id: string) => {
          console.debug(`Marker ${id} clicked`);
        }) as any,
        color: allOnline
          ? 'green'
          : allOffline || location.chargingStations.length === 0
            ? 'red'
            : 'purple',
      } as MarkerProps;
    }) as any) || [];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Row justify="space-between" className="header-row">
        <h2>Locations</h2>
        <AutoComplete
          options={filteredLocations.map((location) => ({
            value: location.id,
            label: `${location.name} - ${location.address}`,
          }))}
          allowClear
          value={searchQuery}
          onSearch={handleSearch}
          onChange={setSearchQuery}
          onSelect={(value) => (window.location.href = `/locations/${value}`)}
        >
          <Input placeholder="Search for a location" />
        </AutoComplete>
      </Row>
      <Row style={{ flex: '1 1 auto' }}>
        <GoogleMapWithMarkers
          markers={markers}
          defaultCenter={{ lat: 36.7783, lng: -119.4179 }}
          zoom={6}
        />
      </Row>
    </div>
  );
};
