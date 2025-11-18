// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { AuthorizationDto } from '@citrineos/base';
import { AuthorizationDetailCard } from '@lib/client/pages/authorizations/detail/authorization.detail.card';
import { getTransactionColumns } from '@lib/client/pages/transactions/columns';
import { Table } from '@lib/client/components/table';
import { Card, CardContent } from '@lib/client/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@lib/client/components/ui/tabs';
import { AuthorizationClass } from '@lib/cls/authorization.dto';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { AUTHORIZATIONS_SHOW_QUERY } from '@lib/queries/authorizations';
import { GET_TRANSACTIONS_FOR_AUTHORIZATION } from '@lib/queries/transactions';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { CanAccess, useOne } from '@refinedev/core';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { pageFlex, pageMargin } from '@lib/client/styles/page';
import { AuthorizationDetailTabsCard } from '@lib/client/pages/authorizations/detail/authorization.detail.tabs.card';

type AuthorizationDetailProps = {
  params: { id: string };
};

export const AuthorizationDetail: React.FC<AuthorizationDetailProps> = ({
  params,
}) => {
  const { id } = params;

  const {
    query: { data: authData, isLoading: authLoading },
  } = useOne<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    id,
    meta: { gqlQuery: AUTHORIZATIONS_SHOW_QUERY },
    queryOptions: getPlainToInstanceOptions(AuthorizationClass, true),
  });
  const authorization = authData?.data;

  if (authLoading) return <p>Loading...</p>;
  if (!authorization) return <p>No Data Found</p>;

  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.SHOW}
      fallback={<AccessDeniedFallback />}
      params={{ id: authorization.id }}
    >
      <div className={`${pageMargin} ${pageFlex}`}>
        <AuthorizationDetailCard authorization={authorization} />

        <AuthorizationDetailTabsCard authorization={authorization} />
      </div>
    </CanAccess>
  );
};
