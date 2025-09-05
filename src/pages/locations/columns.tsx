// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ConditionalFilter, CrudFilters } from '@refinedev/core';
import { Table } from 'antd';
import React from 'react';
import { MenuSection } from '../../components/main-menu/main.menu';
import { LocationDtoProps } from '@citrineos/base';
import { getFullAddress } from '@util/geocoding';

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
          className: 'hoverable-column',
          onClick: () => {
            const path = `/${MenuSection.LOCATIONS}/${record.id}`;
            window.open(path, '_blank');
          },
        })}
        width="25%"
        render={(_: any, record) => {
          return <strong>{record.name}</strong>;
        }}
      />
      <Table.Column
        key={LocationDtoProps.address}
        dataIndex={LocationDtoProps.address}
        title="Address"
        width="45%"
        render={(_: any, record) => <span>{getFullAddress(record)}</span>}
      />
      <Table.Column
        key="totalStations"
        title="Total Stations"
        width="15%"
        render={(_: any, record) => (
          <span>
            {record[LocationDtoProps.chargingPool]
              ? record[LocationDtoProps.chargingPool].length
              : 0}
          </span>
        )}
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
