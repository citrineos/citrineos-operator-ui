// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { BootsListQuery } from '../../graphql/types';
import { Boot } from './Boot';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  BOOTS_CREATE_MUTATION,
  BOOTS_DELETE_MUTATION,
  BOOTS_EDIT_MUTATION,
  BOOTS_GET_QUERY,
  BOOTS_LIST_QUERY,
} from './queries';
import { BOOTS_COLUMNS } from './table-config';
import { Boots } from '../../graphql/schema.types';
import { MdLogin } from 'react-icons/md';

export const BootsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Boot}
      gqlQuery={BOOTS_GET_QUERY}
      editMutation={BOOTS_EDIT_MUTATION}
      createMutation={BOOTS_CREATE_MUTATION}
      deleteMutation={BOOTS_DELETE_MUTATION}
    />
  );
};

export const BootsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<BootsListQuery>({
    resource: ResourceType.BOOTS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: BOOTS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<Boots, BootsListQuery>
      tableProps={tableProps}
      columns={BOOTS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<BootsList />} />
      <Route path="/:id/*" element={<BootsView />} />
    </Routes>
  );
};

// Export the resource configuration
export const resources = [
  {
    name: ResourceType.BOOTS,
    list: '/boots',
    create: '/boots/new',
    show: '/boots/:id',
    edit: '/boots/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <MdLogin />,
  },
];
