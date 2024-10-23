import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { LocationsListQuery } from '../../graphql/types';
import { Location } from './Location';
import { DataModelTable, IDataModelListProps } from '../../components';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  LOCATIONS_CREATE_MUTATION,
  LOCATIONS_DELETE_MUTATION,
  LOCATIONS_EDIT_MUTATION,
  LOCATIONS_GET_QUERY,
  LOCATIONS_LIST_QUERY,
} from './queries';
import { LOCATIONS_COLUMNS } from './table-config';
import { GoogleMapContainer, MarkerProps } from '../../components/map';
import { LocationMarker } from './location-marker';
import { Button, Space } from 'antd';
import { EnvironmentOutlined, TableOutlined } from '@ant-design/icons';
import { Locations } from '../../graphql/schema.types';
import { MdOutlineLocationOn } from 'react-icons/md';

export const LocationsView: React.FC = () => {
  return (
    <>
      <GenericView
        dtoClass={Location}
        gqlQuery={LOCATIONS_GET_QUERY}
        editMutation={LOCATIONS_EDIT_MUTATION}
        createMutation={LOCATIONS_CREATE_MUTATION}
        deleteMutation={LOCATIONS_DELETE_MUTATION}
      />
    </>
  );
};

export const LocationsList: React.FC<IDataModelListProps> = (props) => {
  const { tableProps } = useTable<LocationsListQuery>({
    resource: ResourceType.LOCATIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: LOCATIONS_LIST_QUERY,
    },
  });

  const [viewMode, setViewMode] = useState<'table' | 'map'>(
    props.viewMode ?? 'table',
  );

  const defaultHeight = props.height ?? '92%';
  const isDisplayed = props.viewMode === undefined ? 'inline' : 'none';
  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'map' : 'table'));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Locations[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    const filtered =
      (tableProps.dataSource as unknown as Locations[])?.filter(
        (location: Locations) =>
          location.ChargingStations.some((station) =>
            station.id.includes(lowerCaseQuery),
          ) ||
          location.address?.toLowerCase().includes(lowerCaseQuery) ||
          location.name?.toLowerCase().includes(lowerCaseQuery),
      ) || [];

    setFilteredLocations(filtered);
  };

  // Dynamically generate markers from the dataSource
  const markers: MarkerProps[] =
    tableProps.dataSource?.map(((location: Locations) => {
      const allOnline =
        location.ChargingStations.length > 0 &&
        location.ChargingStations.every((station) => station.isOnline === true);

      const allOffline = location.ChargingStations.every(
        (station) =>
          station.isOnline === false ||
          station.isOnline === null ||
          station.isOnline === undefined,
      );

      return {
        lat: location.coordinates.coordinates[1],
        lng: location.coordinates.coordinates[0],
        identifier: String(location.id),
        content: <LocationMarker location={location} />,
        onClick: ((id: string) => {
          console.debug(`Marker ${id} clicked`);
        }) as any,
        color: allOnline
          ? 'green'
          : allOffline || location.ChargingStations.length === 0
            ? 'red'
            : 'purple',
      } as MarkerProps;
    }) as any) || [];

  return (
    <>
      <Space
        style={{
          marginBottom: '16px',
          display: isDisplayed,
        }}
      >
        <Button
          type="default"
          icon={
            viewMode === 'table' ? <TableOutlined /> : <EnvironmentOutlined />
          }
          onClick={toggleView}
        >
          {viewMode === 'table' ? 'Switch to Map View' : 'Switch to Table View'}
        </Button>
      </Space>

      {viewMode === 'table' ? (
        <DataModelTable<Locations, LocationsListQuery>
          tableProps={tableProps}
          columns={LOCATIONS_COLUMNS(!props.hideActions, props.parentView)}
          hideCreateButton={props.hideCreateButton}
        />
      ) : (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            alignItems: 'center',
            height: defaultHeight,
            justifyContent: 'center',
            marginBottom: '60px',
          }}
        >
          <div
            style={{
              position: 'relative',
            }}
          >
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                color: 'black',
                width: '99%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
              }}
            />
            <ul
              style={{
                top: '44px',
                width: '100%',
                color: 'white',
                zIndex: 10000000,
                maxWidth: '600px',
                listStyle: 'none',
                textAlign: 'left',
                paddingLeft: '20px',
                position: 'absolute',
                backgroundColor: 'black',
              }}
            >
              {filteredLocations.map((location, index) => (
                <li
                  key={index}
                  onClick={() =>
                    (window.location.href = `/locations/${location.id}`)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {location.name} - {location.address}
                </li>
              ))}
            </ul>
          </div>
          <GoogleMapContainer
            markers={markers}
            defaultCenter={{ lat: 36.7783, lng: -119.4179 }}
            zoom={6}
          />
        </div>
      )}
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<LocationsList />} />
      <Route path="/:id/*" element={<LocationsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.LOCATIONS,
    list: '/locations',
    create: '/locations/new',
    show: '/locations/:id',
    edit: '/locations/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <MdOutlineLocationOn />,
  },
];
