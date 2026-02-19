// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { ChargingStationProps, LocationProps } from '@citrineos/base';
import { CanAccess, type CrudFilter } from '@refinedev/core';
import type { ColumnConfiguration } from '@lib/utils/column.configuration';
import type { CellContext } from '@tanstack/react-table';
import {
  type ChargingStationDetailsDto,
  ChargingStationDetailsProps,
} from '@lib/cls/charging.station.dto';
import { TableCellLink } from '@lib/client/components/table-cell-link';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import ProtocolTag from '@lib/client/components/protocol-tag';
import { ACTIONS_COLUMN } from '@lib/client/hooks/useColumnPreferences';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { StartTransactionButton } from '@lib/client/pages/charging-stations/start.transaction.button';
import { StopTransactionButton } from '@lib/client/pages/charging-stations/stop.transaction.button';
import { ResetButton } from '@lib/client/pages/charging-stations/reset.button';
import { CommandsUnavailableText } from '@lib/client/pages/charging-stations/commands.unavailable.text';
import { isEmpty } from '@lib/utils/assertion';
import { EMPTY_VALUE } from '@lib/utils/consts';
import { badgeListStyle } from '@lib/client/styles/page';
import { Badge } from '@lib/client/components/ui/badge';

export const getChargingStationsColumns = (
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
        <ProtocolTag
          protocol={row.original[ChargingStationDetailsProps.protocol]}
        />
      ),
    },
    {
      key: 'vendorModel',
      header: 'Vendor / Model',
      visible: false,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <span>{`${row.original.chargePointVendor ?? EMPTY_VALUE} / ${row.original.chargePointModel ?? EMPTY_VALUE}`}</span>
      ),
    },
    {
      key: ChargingStationDetailsProps.floorLevel,
      header: 'Floor Level',
      visible: false,
    },
    {
      key: ChargingStationDetailsProps.parkingRestrictions,
      header: 'Parking Restrictions',
      visible: false,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <div className={badgeListStyle}>
          {!isEmpty(row.original.parkingRestrictions) ? (
            row.original.parkingRestrictions.map((pr: any) => (
              <Badge key={pr} variant="muted">
                {pr}
              </Badge>
            ))
          ) : (
            <span>{EMPTY_VALUE}</span>
          )}
        </div>
      ),
    },
    {
      key: ChargingStationDetailsProps.capabilities,
      header: 'Capabilities',
      visible: false,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <div className={badgeListStyle}>
          {!isEmpty(row.original.capabilities) ? (
            row.original.capabilities.map((cap: any) => (
              <Badge key={cap} variant="muted">
                {cap}
              </Badge>
            ))
          ) : (
            <span>{EMPTY_VALUE}</span>
          )}
        </div>
      ),
    },
    {
      key: ChargingStationDetailsProps.firmwareVersion,
      header: 'Firmware Version',
      visible: false,
    },
    {
      key: ACTIONS_COLUMN,
      header: 'Actions',
      visible: true,
      cellRender: ({
        row,
      }: CellContext<ChargingStationDetailsDto, unknown>) => {
        const hasActiveTransactions = !isEmpty(row.original.transactions);

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
