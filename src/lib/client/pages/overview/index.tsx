// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Card, CardContent } from '@lib/client/components/ui/card';
import { ActiveTransactionsCard } from '@lib/client/pages/overview/active-transactions/active.transactions.card';
import { ChargerActivityCard } from '@lib/client/pages/overview/charger-activity/charger.activity.card';
import { LocationsCard } from '@lib/client/pages/overview/locations/locations.card';
import { OnlineStatusCard } from '@lib/client/pages/overview/online-status/online.status.card';
import { PluginSuccessRateCard } from '@lib/client/pages/overview/plugin-success-rate/plugin.success.rate.card';

export const Overview = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <OnlineStatusCard />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="pt-6">
            <ChargerActivityCard />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="pt-6">
            <PluginSuccessRateCard />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
        <Card className="lg:col-span-5 w-full locations-card-container min-h-[500px]">
          <CardContent className="pt-6">
            <LocationsCard />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4 w-full">
          <CardContent className="pt-6">
            <ActiveTransactionsCard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
