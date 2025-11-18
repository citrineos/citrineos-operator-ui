// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Loader } from '@lib/client/components/ui/loader';
import { ChargerStatusEnum } from '@lib/client/pages/overview/charger-activity/charger.activity.card';
import { Circle } from '@lib/client/pages/overview/circle/circle';
import '@lib/client/pages/overview/online-status/style.scss';
import { CHARGING_STATIONS_STATUS_COUNT_QUERY } from '@lib/queries/charging.stations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { CanAccess, useCustom } from '@refinedev/core';
import { ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const OnlineStatusCard = () => {
  const { push } = useRouter();

  const {
    query: { data, isLoading, error },
  } = useCustom({
    meta: {
      gqlQuery: CHARGING_STATIONS_STATUS_COUNT_QUERY,
    },
  } as any);

  const onlineCount = data?.data?.online?.aggregate?.count || 0;
  const offlineCount = data?.data?.offline?.aggregate?.count || 0;

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading counts</p>;

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <div className="flex flex-col gap-8">
        <h4 className="text-lg font-semibold">Charger Online Status</h4>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <div className="online-status-number">{onlineCount}</div>
            <div className="flex items-center gap-2">
              <Circle status={ChargerStatusEnum.ONLINE} />
              Online
            </div>
          </div>
          <div className="flex flex-col">
            <div className="online-status-number">{offlineCount}</div>
            <div className="flex items-center gap-2">
              <Circle status={ChargerStatusEnum.OFFLINE} />
              Offline
            </div>
          </div>
        </div>
        <div
          onClick={() => push(`/${MenuSection.CHARGING_STATIONS}`)}
          className="link flex items-center cursor-pointer"
        >
          View all chargers <ChevronRightIcon />
        </div>
      </div>
    </CanAccess>
  );
};
