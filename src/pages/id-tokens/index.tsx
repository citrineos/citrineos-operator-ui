// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../model/interfaces';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '@util/auth';
import { IdToken } from './id-token';
import {
  ID_TOKENS_CREATE_MUTATION,
  ID_TOKENS_DELETE_MUTATION,
  ID_TOKENS_EDIT_MUTATION,
  ID_TOKENS_SHOW_QUERY,
} from './queries';
import { ContainerOutlined } from '@ant-design/icons';

export const IdTokenView: React.FC = () => {
  return (
    <GenericView
      dtoClass={IdToken}
      gqlQuery={ID_TOKENS_SHOW_QUERY}
      editMutation={ID_TOKENS_EDIT_MUTATION}
      createMutation={ID_TOKENS_CREATE_MUTATION}
      deleteMutation={ID_TOKENS_DELETE_MUTATION}
    />
  );
};

export const IdTokenList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable dtoClass={IdToken} />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<IdTokenList />} />
      <Route path="/:id/*" element={<IdTokenView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.ID_TOKENS,
    list: '/id-tokens',
    create: '/id-tokens/new',
    edit: '/id-tokens/:id/edit',
    show: '/id-tokens/:id',
    meta: {
      canDelete: true,
    },
    icon: <ContainerOutlined />,
  },
];
