import React from 'react';
import { Card, Tabs, TabsProps } from 'antd';
import './style.scss';
import { useParams } from 'react-router-dom';
import { useOne } from '@refinedev/core';
import { ResourceType } from '../../../resource-type';
import { getPlainToInstanceOptions } from '@util/tables';
import { LocationDto } from '../../../dtos/location.dto';
import { LOCATIONS_GET_QUERY } from '../queries';
import { LocationsChargingStationsTable } from '../list/locations.charging.stations.table';
import { LocationDetailCard } from './location.detail.card';

export const LocationsDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useOne<LocationDto>({
    resource: ResourceType.LOCATIONS,
    id,
    meta: {
      gqlQuery: LOCATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(LocationDto, true),
  });

  const location = data?.data;

  if (isLoading) return <p>Loading...</p>;
  if (!location) return <p>No Data Found</p>;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Charging Stations',
      children: <LocationsChargingStationsTable location={location} />,
    },
    {
      key: '2',
      label: 'KPI Charts',
      children: 'KPI Charts Content',
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card className="location-details">
        <LocationDetailCard location={location} />
      </Card>

      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </div>
  );
};
