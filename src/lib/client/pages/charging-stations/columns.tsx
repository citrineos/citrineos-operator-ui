// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { ChargingStationProps, LocationProps } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import ProtocolTag from '@lib/client/components/protocol-tag';
import {
  ChargingStationDetailsProps,
  type ChargingStationDetailsDto,
} from '@lib/cls/charging.station.dto';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { CanAccess, type CrudFilter } from '@refinedev/core';
import type { CellContext } from '@tanstack/react-table';
import { StartTransactionButton } from '@lib/client/pages/charging-stations/start.transaction.button';
import { StopTransactionButton } from '@lib/client/pages/charging-stations/stop.transaction.button';
import { ResetButton } from '@lib/client/pages/charging-stations/reset.button';
import { CommandsUnavailableText } from '@lib/client/pages/charging-stations/commands.unavailable.text';
import { TableCellLink } from '@lib/client/components/table-cell-link';
import type { ColumnConfiguration } from '@lib/utils/column.configuration';
import { ACTIONS_COLUMN } from '@lib/client/hooks/useColumnPreferences';

export const getChargingStationColumns = (
  includeLocation = true,
): ColumnConfiguration[] => {
  return [
    {
      key: ChargingStationProps.id,
      header: 'ID',
      visible: true,
      sortable: true,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <TableCellLink
          path={`/${MenuSection.CHARGING_STATIONS}/${row.original.id}`}
          value={row.original.id}
        />
      ),
    },
    ...(includeLocation
      ? [
          {
            key: ChargingStationDetailsProps.location,
            header: 'Location',
            visible: true,
            cellRender: ({
              row,
            }: CellContext<ChargingStationDetailsDto, unknown>) => (
              <TableCellLink
                path={`/${MenuSection.LOCATIONS}/${row.original.location?.id}`}
                value={row.original.location?.name}
              />
            ),
          },
        ]
      : []),
    {
      key: ChargingStationDetailsProps.statusNotifications,
      header: 'Status',
      visible: true,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <span
          className={
            row.original.isOnline ? 'text-success' : 'text-destructive'
          }
        >
          {row.original.isOnline ? 'Online' : 'Offline'}
        </span>
      ),
    },
    {
      key: ChargingStationDetailsProps.protocol,
      header: 'Protocol',
      visible: true,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <ProtocolTag protocol={row.original[ChargingStationProps.protocol]} />
      ),
    },
    {
      key: ACTIONS_COLUMN,
      header: 'Actions',
      visible: true,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => {
        const hasActiveTransactions =
          (row.original.transactions?.length ?? 0) > 0;

        return row.original.isOnline ? (
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.COMMAND}
            params={{
              id: row.original.id,
            }}
          >
            <div className="flex gap-4 flex-1">
              {!hasActiveTransactions && (
                <StartTransactionButton station={row.original} />
              )}
              {hasActiveTransactions && (
                <StopTransactionButton station={row.original} />
              )}
              <ResetButton station={row.original} />
            </div>
          </CanAccess>
        ) : (
          <CommandsUnavailableText />
        );
      },
    },
  ];
};

export const getChargingStationsFilters = (value: string): CrudFilter[] => {
  return [
    {
      operator: 'or',
      value: [
        {
          field: ChargingStationProps.id,
          operator: 'contains',
          value,
        },
        {
          field: `Location.${LocationProps.name}`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
