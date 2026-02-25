// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button } from '@lib/client/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/client/components/ui/select';
import { type BaseRecord, useTranslate } from '@refinedev/core';
import { type UseTableReturnType } from '@refinedev/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';
import { parseAsJson, useQueryState } from 'nuqs';
import { TableQueryStateSchema } from '@lib/client/components/table/fields/table-query-state';
import { isNullOrUndefined } from '@lib/utils/assertion';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPageSizePreference,
  setPageSizePreference,
} from '@lib/utils/store/table.preferences.slice';
import { DEFAULT_TABLE_STATE } from '@lib/utils/consts';

interface DataTablePaginationProps<TData extends BaseRecord = BaseRecord> {
  table: UseTableReturnType<TData>['reactTable'];
  showSelectedText?: boolean;
  tableStateKey?: string;
}

export const Pagination = <TData extends BaseRecord = BaseRecord>({
  table,
  showSelectedText,
  tableStateKey,
}: DataTablePaginationProps<TData>) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const [paginationQueryState, setPaginationQueryState] = useQueryState(
    tableStateKey ?? DEFAULT_TABLE_STATE,
    parseAsJson(TableQueryStateSchema.parse),
  );
  const pageSizePreference = useSelector((state) =>
    getPageSizePreference(state, tableStateKey),
  );

  const setPage = (pageIndex: number) => {
    if (!isNullOrUndefined(tableStateKey)) {
      setPaginationQueryState({
        ...paginationQueryState,
        page: pageIndex + 1,
      }).then();
    } else {
      table.setPageIndex(pageIndex);
    }
  };

  const setPageSize = (pageSizeString: string) => {
    const pageSize = Number(pageSizeString);

    if (!isNullOrUndefined(tableStateKey)) {
      dispatch(
        setPageSizePreference({
          resource: tableStateKey,
          pageSize: pageSize,
        }),
      );
      setPage(0);
    } else {
      table.setPageSize(pageSize);
      table.setPageIndex(0);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-y-4 sm-gap-y-0 items-center justify-between">
      {showSelectedText && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}
      <div className="flex relative flex-col-reverse gap-y-4 sm:gap-y-0 sm:flex-row items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            {translate('pagination.rowsPerPage')}
          </p>
          <Select
            value={`${pageSizePreference}`}
            onValueChange={(value) => setPageSize(value)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">
              {translate('pagination.buttons.goToFirstPage')}
            </span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(table.getState().pagination.pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">
              {translate('pagination.buttons.goToPreviousPage')}
            </span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(table.getState().pagination.pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">
              {translate('pagination.buttons.goToNextPage')}
            </span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">
              {translate('pagination.buttons.goToLastPage')}
            </span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

Pagination.displayName = 'Pagination';
