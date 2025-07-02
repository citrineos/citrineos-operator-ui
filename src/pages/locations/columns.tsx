// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { LocationDtoProps } from '../../dtos/location.dto';
import { CanAccess, ConditionalFilter, CrudFilters } from '@refinedev/core';
import { Table } from 'antd';
import React from 'react';
import { MenuSection } from '../../components/main-menu/main.menu';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';

/**
 * Get column definitions for locations table
 * @returns React.ReactNode with Table.Column definitions
 */
export const getLocationsColumns = (
  push: (path: string, ...rest: unknown[]) => void,
) => {
  return (
    <>
      <Table.Column
        key={LocationDtoProps.name}
        dataIndex={LocationDtoProps.name}
        title="Name"
        sorter={true}
        onCell={(record) => ({
          className: `column-${LocationDtoProps.name}`,
          onClick: (event: React.MouseEvent) => {
            const path = `/${MenuSection.LOCATIONS}/${record.id}`;

            // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
            if (event.ctrlKey || event.metaKey) {
              window.open(path, '_blank');
            } else {
              // Default behavior - navigate in current window
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record) => {
          return <h4>{record.name}</h4>;
        }}
      />
      <Table.Column
        key={LocationDtoProps.address}
        dataIndex={LocationDtoProps.address}
        title="Address"
        onCell={() => ({
          className: `column-${LocationDtoProps.address}`,
        })}
      />
      <Table.Column
        key={LocationDtoProps.city}
        dataIndex={LocationDtoProps.city}
        title="City"
        onCell={() => ({
          className: `column-${LocationDtoProps.city}`,
        })}
      />
      <Table.Column
        key={LocationDtoProps.postalCode}
        dataIndex={LocationDtoProps.postalCode}
        title="Postal Code"
        onCell={() => ({
          className: `column-${LocationDtoProps.postalCode}`,
        })}
      />
      <Table.Column
        key={LocationDtoProps.state}
        dataIndex={LocationDtoProps.state}
        title="State"
        onCell={() => ({
          className: `column-${LocationDtoProps.state}`,
        })}
      />
    </>
  );
};

/**
 * Create filters for searching only location fields
 * @param value Search text
 * @returns CrudFilters for the refine data provider
 */
export const getLocationsFilters = (value: string): CrudFilters => {
  const filters: ConditionalFilter = {
    operator: 'or',
    value: [
      {
        field: LocationDtoProps.name,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.address,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.city,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.state,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.postalCode,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.country,
        operator: 'contains',
        value,
      },
    ],
  };

  return [
    {
      operator: 'or',
      value: [filters],
    },
  ];
};

/**
 * Create filters for searching both location fields and nested charging stations
 * Using Hasura's GraphQL nested filtering capabilities
 * @param value Search text
 * @returns CrudFilters for the refine data provider with nested filtering
 */
export const getLocationAndStationsFilters = (value: string): CrudFilters => {
  // Create location filters for direct location field matching
  const locationFieldsFilter: ConditionalFilter = {
    operator: 'or',
    value: [
      {
        field: LocationDtoProps.name,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.address,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.city,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.state,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.postalCode,
        operator: 'contains',
        value,
      },
      {
        field: LocationDtoProps.country,
        operator: 'contains',
        value,
      },
    ],
  };

  // Create charging station filters for nested charging station fields
  const chargingStationsFilter: ConditionalFilter = {
    operator: 'or',
    value: [
      {
        field: `ChargingStations.id`,
        operator: 'contains',
        value,
      },
    ],
  };

  // Combine both filters with OR
  return [
    {
      operator: 'or',
      value: [locationFieldsFilter, chargingStationsFilter],
    },
  ];
};
