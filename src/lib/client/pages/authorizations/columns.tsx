// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { type AuthorizationDto, AuthorizationProps } from '@citrineos/base';
import { Badge } from '@lib/client/components/ui/badge';
import type { CrudFilter } from '@refinedev/core';
import type { ColumnConfiguration } from '@lib/utils/column.configuration';
import { TableCellLink } from '@lib/client/components/table-cell-link';
import type { CellContext } from '@tanstack/react-table';

export const authorizationsColumns: ColumnConfiguration[] = [
  {
    key: AuthorizationProps.idToken,
    header: 'Authorization ID',
    visible: true,
    sortable: true,
    cellRender: ({ row }: CellContext<AuthorizationDto, unknown>) => (
      <TableCellLink
        path={`/${MenuSection.AUTHORIZATIONS}/${row.original.id}`}
        value={row.original.idToken?.trim() ?? 'No ID'}
      />
    ),
  },
  {
    key: AuthorizationProps.idTokenType,
    header: 'Type',
    visible: true,
    sortable: true,
    cellRender: ({ row }: CellContext<AuthorizationDto, unknown>) => (
      <Badge>{row.original.idTokenType}</Badge>
    ),
  },
  {
    key: AuthorizationProps.status,
    header: 'Status',
    visible: true,
    sortable: true,
    cellRender: ({ row }: CellContext<AuthorizationDto, unknown>) => (
      <Badge>{row.original.status}</Badge>
    ),
  },
  {
    key: AuthorizationProps.concurrentTransaction,
    header: 'Concurrent Transactions',
    visible: true,
    cellRender: ({ row }: CellContext<AuthorizationDto, unknown>) => {
      const concurrentTransaction = row.original.concurrentTransaction;
      return (
        <Badge variant={concurrentTransaction ? 'success' : 'destructive'}>
          {concurrentTransaction ? 'Allowed' : 'Not Allowed'}
        </Badge>
      );
    },
  },
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
