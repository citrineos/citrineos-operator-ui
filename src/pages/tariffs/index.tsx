// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { TariffListQuery } from '../../graphql/types';
import { Tariff } from './Tariff';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  TARIFF_CREATE_MUTATION,
  TARIFF_DELETE_MUTATION,
  TARIFF_EDIT_MUTATION,
  TARIFF_GET_QUERY,
  TARIFF_LIST_QUERY,
} from './queries';
import { TARIFF_COLUMNS } from './table-config';
import { Tariffs } from '../../graphql/schema.types';
import { IoReceiptOutline } from 'react-icons/io5';

export const TariffView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Tariff}
      gqlQuery={TARIFF_GET_QUERY}
      editMutation={TARIFF_EDIT_MUTATION}
      createMutation={TARIFF_CREATE_MUTATION}
      deleteMutation={TARIFF_DELETE_MUTATION}
    />
  );
};

export const TariffList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<TariffListQuery>({
    resource: ResourceType.TARIFFS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: TARIFF_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<Tariffs, TariffListQuery>
      tableProps={tableProps}
      columns={TARIFF_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TariffList />} />
      <Route path="/:id/*" element={<TariffView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.TARIFFS,
    list: '/tariffs',
    create: '/tariffs/new',
    show: '/tariffs/:id',
    edit: '/tariffs/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <IoReceiptOutline />,
  },
];
