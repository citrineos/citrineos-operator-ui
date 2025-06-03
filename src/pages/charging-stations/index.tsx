// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ChargingStationsList } from './list/charging.stations.list';
import { ChargingStationDetail } from './detail/charging.station.detail';
import { ChargingStationUpsert } from './upsert/charging.stations.upsert';
import { CanAccess } from '@refinedev/core';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingStationsList />} />
      <Route
        path="/new"
        element={
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.CREATE}
            fallback={<AccessDeniedFallback />}
          >
            <ChargingStationUpsert />
          </CanAccess>
        }
      />
      <Route path="/:id" element={<ChargingStationDetail />} />
      <Route path="/:id/edit" element={<ChargingStationUpsert />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.CHARGING_STATIONS,
    list: '/charging-stations',
    create: '/charging-stations/new',
    show: '/charging-stations/:id',
    edit: '/charging-stations/:id/edit',
  },
];
