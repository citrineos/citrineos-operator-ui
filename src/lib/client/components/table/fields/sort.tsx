// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { cn } from '@lib/utils/cn';
import type { BaseRecord } from '@refinedev/core';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type { TableFilterProps } from '..';

export const SortAction = <TData extends BaseRecord = BaseRecord>({
  column,
}: Pick<TableFilterProps<TData>, 'column'>) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        column?.toggleSorting(column?.getIsSorted() === 'asc');
      }}
    >
      <div className="inline-flex flex-col">
        <ChevronUpIcon
          className={cn(
            '-mb-1 size-5',
            column?.getIsSorted() === 'asc' ? 'text-foreground' : 'text-ring',
          )}
        />
        <ChevronDownIcon
          className={cn(
            '-mt-1 size-5',
            column?.getIsSorted() === 'desc' ? 'text-foreground' : 'text-ring',
          )}
        />
      </div>
    </div>
  );
};
