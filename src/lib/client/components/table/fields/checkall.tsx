// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button } from '@lib/client/components/ui/button';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@lib/client/components/ui/dropdown-menu';
import { type BaseRecord, type HttpError, useTranslate } from '@refinedev/core';
import type { UseTableReturnType } from '@refinedev/react-table';
import { EllipsisVertical } from 'lucide-react';
import { type FC, forwardRef, type PropsWithChildren } from 'react';

type CheckAllProps = React.ComponentPropsWithoutRef<typeof Checkbox> &
  PropsWithChildren<{
    table: UseTableReturnType<BaseRecord, HttpError>['reactTable'];
    options?: {
      label: string;
      onClick: () => void;
    }[];
  }>;

export const CheckAll: FC<CheckAllProps> = forwardRef<
  React.ComponentRef<typeof Checkbox>,
  CheckAllProps
>(({ table, children, options }, ref) => {
  const translate = useTranslate();
  return (
    <>
      <Checkbox
        ref={ref}
        checked={
          table.getIsSomeRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="translate-y-[2px]"
        aria-label={translate('table.selectAll')}
      />
      {children ||
        (Array.isArray(options) && options.length && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={
                  !(
                    table.getIsSomeRowsSelected() ||
                    table.getIsAllPageRowsSelected()
                  )
                }
                size={'icon'}
                variant={'ghost'}
                className="px-0 w-5"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>
                {translate('table.bulkActions')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!children && Array.isArray(options) && options?.length > 0
                ? options.map((option, key) => (
                    <DropdownMenuItem key={key} onSelect={option.onClick}>
                      {option.label}
                    </DropdownMenuItem>
                  ))
                : children}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
    </>
  );
});

CheckAll.displayName = 'CheckAll';
