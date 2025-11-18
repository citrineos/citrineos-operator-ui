// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { TransactionDto } from '@citrineos/base';
import { TransactionDetailCard } from '@lib/client/pages/transactions/detail/transaction.detail.card';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { TRANSACTION_GET_QUERY } from '@lib/queries/transactions';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useOne } from '@refinedev/core';
import { pageFlex, pageMargin } from '@lib/client/styles/page';
import { TransactionDetailTabsCard } from '@lib/client/pages/transactions/detail/transaction.detail.tabs.card';

type TransactionDetailProps = {
  params: { id: string };
};

export const TransactionDetail = ({ params }: TransactionDetailProps) => {
  const { id } = params;

  const {
    query: { data: transactionData, isLoading },
  } = useOne<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    id,
    meta: { gqlQuery: TRANSACTION_GET_QUERY },
    queryOptions: getPlainToInstanceOptions(TransactionClass, true),
  });
  const transaction = transactionData?.data;

  if (isLoading) return <p>Loading...</p>;
  if (!transaction) return <p>No Data Found</p>;

  return (
    <CanAccess
      resource={ResourceType.TRANSACTIONS}
      action={ActionType.SHOW}
      fallback={<AccessDeniedFallback />}
      params={{ id: transaction.id }}
    >
      <div className={`${pageMargin} ${pageFlex}`}>
        <TransactionDetailCard transaction={transaction} />
        <TransactionDetailTabsCard transaction={transaction} />
      </div>
    </CanAccess>
  );
};
