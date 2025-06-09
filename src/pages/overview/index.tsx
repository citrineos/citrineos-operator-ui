// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Card, Flex } from 'antd';
import { OnlineStatusCard } from './online-status/online.status.card';
import { ChargerActivityCard } from './charger-activity/charger.activity.card';
import { PluginSuccessRateCard } from './plugin-success-rate/plugin.success.rate.card';
import { LocationsCard } from './locations/locations.card';
import { ActiveTransactionsCard } from './active-transactions/active.transactions.card';
import { FaultedChargersCard } from './faulted-chargers/faulted.chargers.card';
import './style.scss';

export const Overview = () => {
  return (
    <Flex vertical gap={16}>
      <Flex gap={16}>
        <Flex flex={1}>
          <Card className="full-width">
            <OnlineStatusCard />
          </Card>
        </Flex>
        <Flex flex={1}>
          <Card className="full-width">
            <ChargerActivityCard />
          </Card>
        </Flex>
        <Flex flex={1}>
          <Card className="full-width">
            <PluginSuccessRateCard />
          </Card>
        </Flex>
      </Flex>
      <Flex gap={16} align="start">
        <Flex flex={5}>
          <Card
            className="full-width locations-card-container"
            style={{ minHeight: 500 }}
          >
            <LocationsCard />
          </Card>
        </Flex>
        <Flex flex={4}>
          <Card className="full-width">
            <ActiveTransactionsCard />
          </Card>
        </Flex>
        {/* <Flex flex={3}>
          <Card className="full-width">
            <FaultedChargersCard />
          </Card>
        </Flex> */}
      </Flex>
    </Flex>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
    </Routes>
  );
};
