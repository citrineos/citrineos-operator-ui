// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button } from '@lib/client/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@lib/client/components/ui/dropdown-menu';
import { useTranslate } from '@refinedev/core';
import { type Table } from '@tanstack/react-table';
import { SlidersHorizontalIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

/**
 * TODO deprecate or revisit, as {@link useColumnPreferences} potentially replaces this.
 */
export const DataTableViewOptions = <TData,>({
  table,
}: DataTableViewOptionsProps<TData>): ReturnType<
  FC<DataTableViewOptionsProps<TData>>
> => {
  const translate = useTranslate();
  const columns = useMemo(() => {
    return table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== 'undefined' && column.getCanHide(),
      );
  }, [table]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
          {translate('buttons.columns')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>
          {translate('table.toggleColumns')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(value)}
            >
              {column?.columnDef?.header?.toString() ||
                translate(`table.columns.${column.id}`, undefined, column.id)}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DataTableViewOptions.displayName = 'DataTableViewOptions';
