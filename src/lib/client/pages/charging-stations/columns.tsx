// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { ChargingStationDto } from '@citrineos/base';
import { ChargingStationProps, LocationProps } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import ProtocolTag from '@lib/client/components/protocol-tag';
import { Table } from '@lib/client/components/table';
import { Button } from '@lib/client/components/ui/button';
import {
  ChargingStationDetailsProps,
  type ChargingStationDetailsDto,
} from '@lib/cls/charging.station.dto';
import { ActionType, CommandType, ResourceType } from '@lib/utils/access.types';
import type { RouterPush } from '@lib/utils/types';
import { CanAccess, type CrudFilter } from '@refinedev/core';
import type { CellContext } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { clickableLinkStyle } from '@lib/client/styles/page';

export const getChargingStationColumns = (
  push: RouterPush,
  showRemoteStartModal: (station: ChargingStationDto) => void,
  handleStopTransactionClick: (station: ChargingStationDto) => void,
  showResetStartModal: (station: ChargingStationDto) => void,
  options?: {
    includeLocationColumn?: boolean;
  },
) => {
  // Default to showing the location column unless explicitly set to false
  const includeLocationColumn = options?.includeLocationColumn !== false;

  const columns = [
    <Table.Column
      id={ChargingStationProps.id}
      key={ChargingStationProps.id}
      accessorKey={ChargingStationProps.id}
      header="ID"
      enableSorting
      cell={({ row }: CellContext<ChargingStationDetailsDto, unknown>) => {
        return (
          <div
            className={clickableLinkStyle}
            onClick={(event: React.MouseEvent) => {
              const path = `/${MenuSection.CHARGING_STATIONS}/${row.original.id}`;

              // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
              if (event.ctrlKey || event.metaKey) {
                window.open(path, '_blank');
              } else {
                // Default behavior - navigate in current window
                push(path);
              }
            }}
          >
            {row.original.id}
          </div>
        );
      }}
    />,
  ];

  // Conditionally add the location column
  if (includeLocationColumn) {
    columns.push(
      <Table.Column
        id={ChargingStationDetailsProps.location}
        key={ChargingStationDetailsProps.location}
        accessorKey="location.name"
        header="Location"
        cell={({ row }: CellContext<ChargingStationDetailsDto, unknown>) => {
          return (
            <div
              className={clickableLinkStyle}
              onClick={(event: React.MouseEvent) => {
                const path = `/${MenuSection.LOCATIONS}/${row.original.location?.id}`;

                // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
                if (event.ctrlKey || event.metaKey) {
                  window.open(path, '_blank');
                } else {
                  // Default behavior - navigate in current window
                  push(path);
                }
              }}
            >
              {row.original.location?.name}
            </div>
          );
        }}
      />,
    );
  }

  // Add the remaining columns
  columns.push(
    <Table.Column
      id={ChargingStationDetailsProps.statusNotifications}
      key={ChargingStationDetailsProps.statusNotifications}
      accessorKey="isOnline"
      header="Status"
      cell={({ row }: CellContext<ChargingStationDetailsDto, unknown>) => {
        return (
          <span
            className={
              row.original.isOnline ? 'text-success' : 'text-destructive'
            }
          >
            {row.original.isOnline ? 'Online' : 'Offline'}
          </span>
        );
      }}
    />,
    <Table.Column
      id={ChargingStationProps.protocol}
      key={ChargingStationProps.protocol}
      accessorKey={ChargingStationProps.protocol}
      header="Protocol"
      cell={({ row }: CellContext<ChargingStationDetailsDto, unknown>) => (
        <ProtocolTag protocol={row.original[ChargingStationProps.protocol]} />
      )}
    />,
    <Table.Column
      id="actions"
      key="actions"
      header="Actions"
      cell={({ row }: CellContext<ChargingStationDetailsDto, unknown>) => {
        const hasActiveTransactions = false; // transactions are not a direct property

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
                <CanAccess
                  resource={ResourceType.CHARGING_STATIONS}
                  action={ActionType.COMMAND}
                  params={{
                    id: row.original.id,
                    commandType: CommandType.START_TRANSACTION,
                  }}
                >
                  <Button onClick={() => showRemoteStartModal(row.original)}>
                    Start Transaction
                  </Button>
                </CanAccess>
              )}
              {hasActiveTransactions && (
                <CanAccess
                  resource={ResourceType.CHARGING_STATIONS}
                  action={ActionType.COMMAND}
                  params={{
                    id: row.original.id,
                    commandType: CommandType.STOP_TRANSACTION,
                  }}
                >
                  <Button
                    variant="destructive"
                    onClick={() => handleStopTransactionClick(row.original)}
                  >
                    Stop Transaction
                  </Button>
                </CanAccess>
              )}
              <CanAccess
                resource={ResourceType.CHARGING_STATIONS}
                action={ActionType.COMMAND}
                params={{
                  id: row.original.id,
                  commandType: CommandType.RESET,
                }}
              >
                <Button
                  variant="outline"
                  onClick={() => showResetStartModal(row.original)}
                >
                  Reset
                </Button>
              </CanAccess>
            </div>
          </CanAccess>
        ) : (
          <div className="flex gap-4 flex-1 items-center text-muted-foreground">
            <Info className="h-4 w-4" />
            <span className="text-sm">
              Station offline - commands unavailable
            </span>
          </div>
        );
      }}
    />,
  );

  return columns;
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
