// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { cn } from '@lib/utils/cn';
import type { BaseRecord } from '@refinedev/core';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type { TableFilterProps } from '..';
import { parseAsJson, useQueryState } from 'nuqs';
import { TableQueryStateSchema } from '@lib/client/components/table/fields/table-query-state';

/**
 * SortAction assumes that sorting is happening SERVER-side. If there is client-side
 * sorting needed, this component should use the built-in sorting found on columns,
 * such as "column.toggleSorting()" and "column.getIsSorted()".
 */
export const SortAction = <TData extends BaseRecord = BaseRecord>({
  column,
  tableStateKey,
}: Pick<TableFilterProps<TData>, 'column'> & {
  tableStateKey: string;
}) => {
  const [tableQueryState, setTableQueryState] = useQueryState(
    tableStateKey,
    parseAsJson(TableQueryStateSchema.parse),
  );

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        const newParams = { ...(tableQueryState ?? {}) };

        if (tableQueryState?.sortBy !== column.id) {
          newParams.sortBy = column.id;
          newParams.direction = 'asc';
        } else if (tableQueryState?.direction === 'asc') {
          newParams.sortBy = column.id;
          newParams.direction = 'desc';
        } else {
          delete newParams.sortBy;
          delete newParams.direction;
        }

        setTableQueryState(
          Object.keys(newParams).length > 0 ? newParams : null,
        ).then();
      }}
    >
      <div className="inline-flex flex-col">
        <ChevronUpIcon
          className={cn(
            '-mb-1 size-5',
            tableQueryState?.sortBy === column.id &&
              tableQueryState?.direction === 'asc'
              ? 'text-foreground'
              : 'text-ring',
          )}
        />
        <ChevronDownIcon
          className={cn(
            '-mt-1 size-5',
            tableQueryState?.sortBy === column.id &&
              tableQueryState?.direction === 'desc'
              ? 'text-foreground'
              : 'text-ring',
          )}
        />
      </div>
    </div>
  );
};
