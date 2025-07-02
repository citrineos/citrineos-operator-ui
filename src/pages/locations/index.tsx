// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { LocationsList } from './list/locations.list';
import { LocationsUpsert } from './upsert/locations.upsert';
import { LocationsDetail } from './detail/locations.detail';
import { LocationsMap } from './map/locations.map';
import { CanAccess } from '@refinedev/core';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<LocationsList />} />
      <Route path="/map" element={<LocationsMap />} />
      <Route
        path="/new"
        element={
          <CanAccess
            resource={ResourceType.LOCATIONS}
            action={ActionType.CREATE}
            fallback={<AccessDeniedFallback />}
          >
            <LocationsUpsert />
          </CanAccess>
        }
      />
      <Route path="/:id" element={<LocationsDetail />} />
      <Route path="/:id/edit" element={<LocationsUpsert />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.LOCATIONS,
    list: '/locations',
    create: '/locations/new',
    show: '/locations/:id',
    edit: '/locations/:id/edit',
  },
];
