// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { PartnersList } from './list/partners.list';
import { PartnersUpsert } from './upsert/partners.upsert';
import { PartnersDetail } from './detail/partners.detail';
import { CanAccess } from '@refinedev/core';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PartnersList />} />
      <Route
        path="/new"
        element={
          <CanAccess
            resource={ResourceType.PARTNERS}
            action={ActionType.CREATE}
            fallback={<AccessDeniedFallback />}
          >
            <PartnersUpsert />
          </CanAccess>
        }
      />
      <Route path="/:id" element={<PartnersDetail />} />
      <Route path="/:id/edit" element={<PartnersUpsert />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.PARTNERS,
    list: '/partners',
    create: '/partners/new',
    show: '/partners/:id',
    edit: '/partners/:id/edit',
  },
];
