// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthorizationsList } from './list/authorization.list';
import { AuthorizationDetail } from './detail/authorization.detail';
import { ResourceType } from '@util/auth';
import { ContainerOutlined } from '@ant-design/icons';
import { AuthorizationUpsert } from './upsert/authorization.upsert';

export const routes: React.FC = () => (
  <Routes>
    <Route index element={<AuthorizationsList />} />
    <Route path="/new" element={<AuthorizationUpsert />} />
    <Route path="/:id" element={<AuthorizationDetail />} />
    {/* <Route path="/:id/edit" element={<AuthorizationUpsert />} /> */}
  </Routes>
);

export const resources = [
  {
    name: ResourceType.AUTHORIZATIONS,
    list: '/authorizations',
    create: '/authorizations/new',
    show: '/authorizations/:id',
    // edit: '/authorizations/:id/edit',
    meta: { canDelete: false },
    icon: <ContainerOutlined />,
  },
];
