import { Popover, TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { LOCATIONS_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import { Locations } from '../../graphql/schema.types';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { ChargingStationsList } from '../charging-stations';
import { GoogleMapContainer } from '../../components/map';
import React from 'react';
import { Point } from 'geojson';
import { AimOutlined } from '@ant-design/icons';

export const LOCATIONS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
): TableColumnsType<Locations> => {
  const baseColumns: TableColumnsType<Locations> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'address',
      title: 'Address',
    },
    {
      dataIndex: 'city',
      title: 'City',
    },
    {
      dataIndex: 'postalCode',
      title: 'Postal Code',
    },
    {
      dataIndex: 'state',
      title: 'State',
    },
    {
      dataIndex: 'country',
      title: 'Country',
    },
    {
      dataIndex: 'coordinates',

      title: 'Coordinates',
      render: (_: any, record: Locations) => {
        const coordinates = record.coordinates as Point;
        const content = (
          <>
            <GoogleMapContainer
              defaultCenter={{
                lat: coordinates.coordinates[1],
                lng: coordinates.coordinates[0],
              }}
            />
            <div>Latitude: {coordinates.coordinates[1]}</div>
            <div>Longitude: {coordinates.coordinates[0]}</div>
          </>
        );
        return (
          <Popover placement="topLeft" content={content}>
            <AimOutlined />
          </Popover>
        );
      },
    },
    {
      dataIndex: 'ChargingStations',
      title: 'Charging Stations',
      render: (_: any, record: Locations) => {
        if (!record?.ChargingStations || record.ChargingStations.length === 0) {
          return '';
        }

        const stationIds = record.ChargingStations.map((station) => station.id);
        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'in', stationIds);

        return (
          <ExpandableColumn
            expandedContent={
              <ChargingStationsList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.LOCATIONS}
              />
            }
            multipleNested={true}
            viewTitle={`Charging Stations linked to Location with ID ${record.id}`}
          />
        );
      },
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: Locations) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={LOCATIONS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
