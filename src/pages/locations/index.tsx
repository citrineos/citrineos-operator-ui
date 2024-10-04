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
    <GenericView
      dtoClass={Location}
      gqlQuery={LOCATIONS_GET_QUERY}
      editMutation={LOCATIONS_EDIT_MUTATION}
      createMutation={LOCATIONS_CREATE_MUTATION}
      deleteMutation={LOCATIONS_DELETE_MUTATION}
    />
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

  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'map' : 'table'));
  };

  // Dynamically generate markers from the dataSource
  const markers: MarkerProps[] =
    tableProps.dataSource?.map(((location: Locations) => {
      return {
        lat: location.coordinates.coordinates[1],
        lng: location.coordinates.coordinates[0],
        identifier: String(location.id),
        content: <LocationMarker location={location} />,
        onClick: ((id: string) => {
          console.debug(`Marker ${id} clicked`);
        }) as any,
      } as MarkerProps;
    }) as any) || [];
  return (
    <>
      <Space style={{ marginBottom: '16px' }}>
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
        <GoogleMapContainer
          markers={markers}
          defaultCenter={{ lat: 36.7783, lng: -119.4179 }}
          zoom={6}
        />
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
