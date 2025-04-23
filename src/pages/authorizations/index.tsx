import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthorizationsList } from './list/authorization.list';
import { AuthorizationDetail } from './detail/authorization.detail';
import { ResourceType } from '@util/auth';
import { ContainerOutlined } from '@ant-design/icons';

export const routes: React.FC = () => (
  <Routes>
    <Route index element={<AuthorizationsList />} />
    <Route path="/:id" element={<AuthorizationDetail />} />
  </Routes>
);

export const resources = [
  {
    name: ResourceType.AUTHORIZATIONS,
    list: '/authorizations',
    show: '/authorizations/:id',
    meta: { canDelete: false },
    icon: <ContainerOutlined />,
  },
];
