// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Table } from '@lib/client/components/table';
import {
  getTransactionColumns,
  getTransactionsFilters,
} from '@lib/client/pages/transactions/columns';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { TRANSACTION_LIST_QUERY } from '@lib/queries/transactions';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { DEFAULT_SORTERS, EMPTY_FILTER } from '@lib/utils/consts';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useTranslate } from '@refinedev/core';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { heading2Style, pageMargin } from '@lib/client/styles/page';
import {
  tableHeaderWrapperFlex,
  tableWrapperStyle,
} from '@lib/client/styles/table';
import { DebounceSearch } from '@lib/client/components/debounce-search';

export const TransactionsList = () => {
  const { push } = useRouter();
  const [filters, setFilters] = useState<any>(EMPTY_FILTER);
  const translate = useTranslate();

  const columns = useMemo(() => getTransactionColumns(push), [push]);

  const onSearch = (value: string) => {
    setFilters(value ? getTransactionsFilters(value) : EMPTY_FILTER);
  };

  return (
    <div className={`${pageMargin} ${tableWrapperStyle}`}>
      <div className={tableHeaderWrapperFlex}>
        <h2 className={heading2Style}>
          {translate('Transactions.Transactions')}
        </h2>
        <DebounceSearch
          onSearch={onSearch}
          placeholder={`${translate('placeholders.search')} ${translate('Transactions.Transactions')}`}
        />
      </div>
      <CanAccess
        resource={ResourceType.TRANSACTIONS}
        action={ActionType.LIST}
        fallback={<AccessDeniedFallback />}
      >
        <Table
          refineCoreProps={{
            resource: ResourceType.TRANSACTIONS,
            sorters: DEFAULT_SORTERS,
            filters: {
              permanent: filters,
            },
            meta: {
              gqlQuery: TRANSACTION_LIST_QUERY,
            },
            queryOptions: {
              ...getPlainToInstanceOptions(TransactionClass),
              select: (data: any) => {
                return data;
              },
            },
          }}
          enableSorting
          enableFilters
          showHeader
        >
          {columns}
        </Table>
      </CanAccess>
    </div>
  );
};
