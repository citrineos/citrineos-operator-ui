// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import type { CellContext } from '@tanstack/react-table';
import { Table } from '@lib/client/components/table';
import type { ColumnConfiguration } from '@lib/utils/column.configuration';

const EMPTY_PLACEHOLDER = '-';

/**
 * useColumnPreferences assists with rendering table columns based on
 * preferences stored in redux and changing column visibility.
 *
 * @param allColumns - all available table columns
 */
export const useColumnPreferences = (allColumns: ColumnConfiguration[]) => {
  const renderedVisibleColumns = allColumns
    .filter((c) => c.visible)
    .map((c) => (
      <Table.Column
        id={c.key}
        key={c.key}
        accessorKey={c.accessorKey ?? c.key}
        header={c.header}
        enableSorting={c.sortable}
        cell={(context: CellContext<any, unknown>) =>
          c.cellRender ? (
            c.cellRender(context)
          ) : (
            <span>{context.row.original[c.key] ?? EMPTY_PLACEHOLDER}</span>
          )
        }
      />
    ));

  return {
    renderedVisibleColumns,
  };
};
