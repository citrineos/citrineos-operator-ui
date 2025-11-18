// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  AuthorizationProps,
  LocationProps,
  OCPP2_0_1,
  TransactionProps,
} from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table } from '@lib/client/components/table';
import GenericTag from '@lib/client/components/tag';
import { TimestampDisplay } from '@lib/client/components/timestamp-display';
import type { RouterPush } from '@lib/utils/types';
import { CircleCheck, CircleX } from 'lucide-react';
import React from 'react';
import { clickableLinkStyle } from '@lib/client/styles/page';
import { buttonIconSize } from '@lib/client/styles/icon';
import type { CrudFilters } from '@refinedev/core';

/**
 * Get column definitions for transactions table
 * @returns React.ReactNode with Table.Column definitions
 */
export const getTransactionColumns = (push: RouterPush) => {
  return [
    <Table.Column
      id={TransactionProps.transactionId}
      key={TransactionProps.transactionId}
      accessorKey={TransactionProps.transactionId}
      header="Transaction ID"
      enableSorting
      cell={({ row }) => {
        return (
          <div
            className={clickableLinkStyle}
            onClick={(event: React.MouseEvent) => {
              const path = `/${MenuSection.TRANSACTIONS}/${row.original.id}`;
              if (event.ctrlKey || event.metaKey) {
                window.open(path, '_blank');
              } else {
                push(path);
              }
            }}
          >
            {row.original.transactionId}
          </div>
        );
      }}
    />,
    <Table.Column
      id={TransactionProps.isActive}
      key={TransactionProps.isActive}
      accessorKey={TransactionProps.isActive}
      header="Active"
      cell={({ row }) =>
        row.original.isActive ? (
          <CircleCheck className={`${buttonIconSize} text-success`} />
        ) : (
          <CircleX className={`${buttonIconSize} text-destructive`} />
        )
      }
    />,
    <Table.Column
      id="chargingStation"
      key="chargingStation"
      accessorKey="chargingStation.id"
      header="Station ID"
      enableSorting
      cell={({ row }) => {
        return (
          <div
            className={clickableLinkStyle}
            onClick={(event: React.MouseEvent) => {
              const path = `/${MenuSection.CHARGING_STATIONS}/${row.original.chargingStation?.id}`;
              if (event.ctrlKey || event.metaKey) {
                window.open(path, '_blank');
              } else {
                push(path);
              }
            }}
          >
            {row.original.chargingStation?.id}
          </div>
        );
      }}
    />,
    <Table.Column
      id="location"
      key="location"
      accessorKey="location.name"
      header="Location"
      enableSorting
      cell={({ row }) => {
        return (
          <div
            className={clickableLinkStyle}
            onClick={(event: React.MouseEvent) => {
              const path = `/${MenuSection.LOCATIONS}/${row.original.location?.id}`;
              if (event.ctrlKey || event.metaKey) {
                window.open(path, '_blank');
              } else {
                push(path);
              }
            }}
          >
            {row.original.location?.name}
          </div>
        );
      }}
    />,
    <Table.Column
      id={AuthorizationProps.idToken}
      key={AuthorizationProps.idToken}
      accessorKey="authorization.idToken"
      header="ID Token"
      cell={({ row }) => {
        const idToken = row.original.authorization?.idToken;
        return idToken ? <h4>{idToken}</h4> : <span>—</span>;
      }}
    />,
    <Table.Column
      id={TransactionProps.totalKwh}
      key={TransactionProps.totalKwh}
      accessorKey={TransactionProps.totalKwh}
      header="Total kWh"
      enableSorting
      cell={({ row }) => <>{row.original.totalKwh?.toFixed(2)} kWh</>}
    />,
    <Table.Column
      id="status"
      key="status"
      accessorKey={TransactionProps.chargingState}
      header="Status"
      cell={({ row }) =>
        row.original.chargingState ? (
          <GenericTag
            enumValue={
              row.original.chargingState as OCPP2_0_1.ChargingStateEnumType
            }
            enumType={OCPP2_0_1.ChargingStateEnumType}
          />
        ) : null
      }
    />,
    <Table.Column
      id={TransactionProps.startTime}
      key={TransactionProps.startTime}
      accessorKey={TransactionProps.startTime}
      header="Start Time"
      enableSorting
      cell={({ row }) => (
        <TimestampDisplay isoTimestamp={row.original.startTime} />
      )}
    />,
    <Table.Column
      id={TransactionProps.endTime}
      key={TransactionProps.endTime}
      accessorKey={TransactionProps.endTime}
      header="End Time"
      enableSorting
      cell={({ row }) => (
        <TimestampDisplay isoTimestamp={row.original.endTime} />
      )}
    />,
  ];
};

export const getTransactionsFilters = (value: string): CrudFilters => {
  return [
    {
      operator: 'or',
      value: [
        {
          field: TransactionProps.transactionId,
          operator: 'contains',
          value,
        },
        {
          field: `Location.${LocationProps.name}`,
          operator: 'contains',
          value,
        },
        {
          field: TransactionProps.stationId,
          operator: 'contains',
          value,
        },
        {
          field: TransactionProps.chargingState,
          operator: 'contains',
          value,
        },
        {
          field: `Authorization.${AuthorizationProps.idToken}`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
