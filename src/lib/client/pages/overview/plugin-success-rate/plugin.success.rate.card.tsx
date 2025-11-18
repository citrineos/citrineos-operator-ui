// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Loader } from '@lib/client/components/ui/loader';
import { TRANSACTION_SUCCESS_RATE_QUERY } from '@lib/queries/transactions';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { CanAccess, useCustom } from '@refinedev/core';

export const PluginSuccessRateCard = () => {
  const {
    query: { data, isLoading, error },
  } = useCustom({
    meta: {
      gqlQuery: TRANSACTION_SUCCESS_RATE_QUERY,
    },
  } as any);

  const successCount = data?.data?.success?.aggregate?.count || 0;
  const totalCount = data?.data?.total?.aggregate?.count || 0;
  const percentage = (successCount / totalCount) * 100;
  const roundedPercentage = Math.round(percentage * 10) / 10;

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading success rate</p>;

  return (
    <CanAccess
      resource={ResourceType.TRANSACTIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <div className="flex flex-col gap-8 plugin-success-rate">
        <h4 className="text-lg font-semibold">Plug-in Success Rate</h4>
        <div className="w-[200px] h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${roundedPercentage}%` }}
          />
        </div>
        <div className="plugin-success-rate-percentage">
          {roundedPercentage}%
        </div>
      </div>
    </CanAccess>
  );
};
