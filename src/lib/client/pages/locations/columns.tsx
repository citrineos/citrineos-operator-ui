// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import {
  LocationProps,
  type LocationDto,
  ChargingStationProps,
} from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table } from '@lib/client/components/table';
import { getFullAddress } from '@lib/utils/geocoding';
import { clickableLinkStyle } from '@lib/client/styles/page';
import { ChevronDownIcon } from 'lucide-react';

/**
 * Get column definitions for locations table
 * @returns React.ReactNode with Table.Column definitions
 */
export const getLocationsColumns = (push: (path: string) => void) => [
  <Table.Column
    key={LocationProps.name}
    id={LocationProps.name}
    accessorKey={LocationProps.name}
    header="Name"
    cell={({ row }) => (
      <div
        className={clickableLinkStyle}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          const path = `/${MenuSection.LOCATIONS}/${row.original.id}`;

          // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
          if (event.ctrlKey || event.metaKey) {
            window.open(path, '_blank');
          } else {
            // Default behavior - navigate in current window
            push(path);
          }
        }}
      >
        {row.original.name || 'Unnamed Location'}
      </div>
    )}
  />,
  <Table.Column
    key={LocationProps.address}
    id={LocationProps.address}
    accessorKey={LocationProps.address}
    header="Address"
    cell={({ row }) => (
      <span>
        {row.original.address
          ? getFullAddress(row.original as Partial<LocationDto>)
          : 'No address'}
      </span>
    )}
  />,
  <Table.Column
    key="totalStations"
    id="totalStations"
    accessorKey="totalStations"
    header="Total Stations"
    cell={({ row }) => <span>{row.original.chargingPool?.length ?? 0}</span>}
  />,
  <Table.Column
    key="actions"
    id="actions"
    accessorKey="actions"
    header=""
    cell={({ row }) => (
      <div
        className="flex items-center justify-end gap-2 cursor-pointer hover:text-primary transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          row.toggleExpanded();
        }}
      >
        <span className="text-sm">View Stations</span>
        <ChevronDownIcon
          className={`transition-transform duration-200 ${
            row.getIsExpanded() ? 'rotate-180' : ''
          }`}
        />
      </div>
    )}
  />,
];

/**
 * Create filters for searching both location fields and nested charging stations
 * Using Hasura's GraphQL nested filtering capabilities
 * @param value Search text
 * @returns An object containing the "where" and custom "chargingStationsWhere" query that
 * will be passed directly to gqlVariables.
 */
export const getLocationFilters = (
  value: string,
): {
  where: Record<string, any[]>;
  chargingStationsWhere: Record<string, any[]>;
} => {
  if (!value) {
    return {
      where: {},
      chargingStationsWhere: {},
    };
  }

  const filterValue = `%${value}%`;

  // Location filters + Charging Station filter, the latter of which
  // is required on BOTH levels of the filter, hence the duplication.
  const locationFieldsFilter = {
    _or: [
      {
        [LocationProps.name]: {
          _ilike: filterValue,
        },
      },
      {
        [LocationProps.city]: {
          _ilike: filterValue,
        },
      },
      {
        [LocationProps.state]: {
          _ilike: filterValue,
        },
      },
      {
        [LocationProps.postalCode]: {
          _ilike: filterValue,
        },
      },
      {
        [LocationProps.country]: {
          _ilike: filterValue,
        },
      },
      {
        ChargingStations: {
          [ChargingStationProps.id]: {
            _ilike: filterValue,
          },
        },
      },
    ],
  };

  // Create charging station filters for nested charging station fields
  const chargingStationsFilter = {
    _or: [
      {
        [ChargingStationProps.id]: {
          _ilike: filterValue,
        },
      },
    ],
  };

  return {
    where: locationFieldsFilter,
    chargingStationsWhere: chargingStationsFilter,
  };
};
