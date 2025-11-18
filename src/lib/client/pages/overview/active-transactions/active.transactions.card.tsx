// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { TransactionDto } from '@citrineos/base';
import { BaseProps, TransactionProps } from '@citrineos/base';
import { Combobox } from '@lib/client/components/combobox';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { TRANSACTION_LIST_QUERY } from '@lib/queries/transactions';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useList } from '@refinedev/core';
import { ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ActiveTransactionsCard = () => {
  const { push } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<any[]>([]);

  const {
    query: { data, isLoading, isError },
  } = useList<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    meta: {
      gqlQuery: TRANSACTION_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 3,
        where: { isActive: { _eq: true } },
      },
    },
    queryOptions: getPlainToInstanceOptions(TransactionClass),
    sorters: [{ field: BaseProps.updatedAt, order: 'desc' }],
    pagination: {
      mode: 'off',
    },
  });

  const {
    query: { data: searchData },
  } = useList<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    filters: searchFilters,
    meta: {
      gqlQuery: TRANSACTION_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 5,
        where: { isActive: { _eq: true } },
      },
    },
    queryOptions: {
      ...getPlainToInstanceOptions(TransactionClass),
      enabled: searchFilters.length > 0,
    },
    sorters: [{ field: BaseProps.updatedAt, order: 'desc' }],
    pagination: { mode: 'off' },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (!value) {
      setSearchFilters([]);
      return;
    }
    setSearchFilters([
      {
        operator: 'and',
        value: [
          {
            field: TransactionProps.transactionId,
            operator: 'contains',
            value,
          },
        ],
      },
    ]);
  };

  const searchResults = searchData?.data || [];
  const transactions = data?.data ?? [];
  const total = data?.total ?? 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <CanAccess resource={ResourceType.TRANSACTIONS} action={ActionType.LIST}>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">
            Active Transactions ({total})
          </h4>
          <div
            className="link flex items-center cursor-pointer"
            onClick={() => push(`/${MenuSection.TRANSACTIONS}`)}
          >
            View all <ChevronRightIcon />
          </div>
        </div>
        <div className="py-6">
          <div className="w-full pr-8">
            <Combobox<number>
              options={searchResults.map((tx) => ({
                label: tx.transactionId,
                value: tx.id!,
              }))}
              onSelect={(id) => push(`/${MenuSection.TRANSACTIONS}/${id}`)}
              onSearch={handleSearch}
              placeholder="Search Transaction"
            />
          </div>
        </div>
        <div className="flex flex-col">
          {transactions.map((transaction) => (
            <div className="flex flex-col mb-4" key={transaction.id}>
              <div
                className="flex justify-between cursor-pointer"
                onClick={() =>
                  push(`/${MenuSection.TRANSACTIONS}/${transaction.id}`)
                }
              >
                <span className="link">{transaction.transactionId}</span>
              </div>
              <div>Station ID: {transaction.stationId}</div>
              <div>Total kWh: {transaction.totalKwh}</div>
              <div>Total Time: {transaction.timeSpentCharging}</div>
              <div>Status: {transaction.chargingState}</div>
            </div>
          ))}
        </div>
      </div>
    </CanAccess>
  );
};
