// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Button, Row, Space, Tabs, Tooltip } from 'antd';
import { LocationDto } from '../../../dtos/location.dto';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { useList } from '@refinedev/core';
import { ResourceType } from '@util/auth';
import { plainToInstance } from 'class-transformer';
import { LocationMap } from '../../../components/map';
import { LOCATIONS_LIST_QUERY } from '../../locations/queries';
import { CHARGING_STATIONS_LIST_QUERY } from '../../charging-stations/queries';
import './style.scss';

export interface CombinedMapProps {
  defaultCenter?: google.maps.LatLngLiteral;
  defaultZoom?: number;
}

export const CombinedMap: React.FC<CombinedMapProps> = ({
  defaultCenter = { lat: 36.7783, lng: -119.4179 },
  defaultZoom = 6,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'locations' | 'stations'>(
    'all',
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    'location' | 'station' | 'mixed' | null
  >(null);

  // Fetch locations data
  const { data: locationsData } = useList<LocationDto>({
    resource: ResourceType.LOCATIONS,
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

  // Fetch stations data
  const { data: stationsData } = useList<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    meta: {
      gqlQuery: CHARGING_STATIONS_LIST_QUERY,
    },
    queryOptions: {
      select: (data) => ({
        ...data,
        data: data.data.map((item) =>
          plainToInstance(ChargingStationDto, item),
        ),
      }),
    },
  });

  const locations = locationsData?.data || [];
  const stations = stationsData?.data || [];

  // Handle marker click
  const handleMarkerClick = (
    id: string,
    type: 'station' | 'location' | 'mixed',
  ) => {
    setSelectedId(id);
    setSelectedType(type);

    // Optionally navigate to the details page
    // if (type === 'location') {
    //   window.location.href = `/locations/${id}`;
    // } else {
    //   window.location.href = `/charging-stations/${id}`;
    // }
  };

  return (
    <div className="combined-map-container">
      <Row className="map-controls" justify="space-between" align="middle">
        <h2>Network Overview</h2>
        <Space>
          <Tabs
            activeKey={activeTab}
            onChange={(key) =>
              setActiveTab(key as 'all' | 'locations' | 'stations')
            }
            items={[
              { key: 'all', label: 'All' },
              { key: 'locations', label: 'Locations' },
              { key: 'stations', label: 'Stations' },
            ]}
          />
          {selectedId && selectedType && (
            <Tooltip title={`View ${selectedType} details`}>
              <Button
                type="primary"
                onClick={() => {
                  window.location.href =
                    selectedType === 'location'
                      ? `/locations/${selectedId}`
                      : `/charging-stations/${selectedId}`;
                }}
              >
                View Details
              </Button>
            </Tooltip>
          )}
        </Space>
      </Row>

      <div className="map-wrapper">
        <LocationMap
          locations={locations}
          defaultCenter={defaultCenter}
          zoom={defaultZoom}
          onMarkerClick={handleMarkerClick}
          selectedMarkerId={selectedId || undefined}
          // clusterByLocation={activeTab !== 'stations'} // Only cluster by location when not in stations-only view
        />
      </div>

      <Row className="map-footer">
        <Space>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: 'var(--primary-color-1)' }}
            ></div>
            <span>Online</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: 'var(--grayscale-color-2)' }}
            ></div>
            <span>Partial</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: 'var(--secondary-color-2)' }}
            ></div>
            <span>Offline</span>
          </div>
        </Space>
      </Row>
    </div>
  );
};

// Helper functions
const determineLocationStatus = (
  location: LocationDto,
): 'online' | 'offline' | 'partial' => {
  if (!location.chargingStations || location.chargingStations.length === 0) {
    return 'offline';
  }

  const onlineCount = location.chargingStations.filter(
    (station) => station.isOnline,
  ).length;

  if (onlineCount === location.chargingStations.length) {
    return 'online';
  } else if (onlineCount === 0) {
    return 'offline';
  } else {
    return 'partial';
  }
};

const determineLocationColor = (location: LocationDto): string => {
  const status = determineLocationStatus(location);

  switch (status) {
    case 'online':
      return 'var(--primary-color-1)';
    case 'partial':
      return 'var(--grayscale-color-2)';
    case 'offline':
    default:
      return 'var(--secondary-color-2)';
  }
};
