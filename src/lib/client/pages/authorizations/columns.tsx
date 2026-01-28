// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table } from '@lib/client/components/table';
import { AuthorizationProps } from '@citrineos/base';
import { clickableLinkStyle } from '@lib/client/styles/page';
import { Badge } from '@lib/client/components/ui/badge';
import type { CrudFilter } from '@refinedev/core';

/**
 * Get column definitions for authorizations table
 * @returns React.ReactNode with Table.Column definitions
 */
export const getAuthorizationColumns = (push: (path: string) => void) => [
  <Table.Column
    id={AuthorizationProps.idToken}
    key={AuthorizationProps.idToken}
    accessorKey={AuthorizationProps.idToken}
    header="Authorization ID"
    enableSorting
    cell={({ row }) => {
      return (
        <div
          className={clickableLinkStyle}
          onClick={(event: React.MouseEvent) => {
            const path = `/${MenuSection.AUTHORIZATIONS}/${row.original.id}`;

            // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
            if (event.ctrlKey || event.metaKey) {
              window.open(path, '_blank');
            } else {
              // Default behavior - navigate in current window
              push(path);
            }
          }}
        >
          {row.original.idToken ?? 'No ID'}
        </div>
      );
    }}
  />,
  <Table.Column
    id={AuthorizationProps.idTokenType}
    key={AuthorizationProps.idTokenType}
    accessorKey={AuthorizationProps.idTokenType}
    header="Type"
    enableSorting
    cell={({ row }) => {
      return <Badge>{row.original.idTokenType}</Badge>;
    }}
  />,
  <Table.Column
    id={AuthorizationProps.status}
    key={AuthorizationProps.status}
    accessorKey={AuthorizationProps.status}
    header="Status"
    enableSorting
    cell={({ row }) => {
      return <Badge>{row.original.status}</Badge>;
    }}
  />,
  <Table.Column
    id={AuthorizationProps.concurrentTransaction}
    key={AuthorizationProps.concurrentTransaction}
    accessorKey={AuthorizationProps.concurrentTransaction}
    header="Concurrent Transactions"
    cell={({ row }) => {
      const concurrentTransaction = row.original.concurrentTransaction;
      return (
        <Badge variant={concurrentTransaction ? 'success' : 'destructive'}>
          {concurrentTransaction ? 'Allowed' : 'Not Allowed'}
        </Badge>
      );
    }}
  />,
];

export const getAuthorizationFilters = (value: string): CrudFilter[] => {
  return [
    {
      operator: 'or',
      value: [
        {
          field: `${AuthorizationProps.idToken}`,
          operator: 'contains',
          value,
        },
        {
          field: `${AuthorizationProps.idTokenType}`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
