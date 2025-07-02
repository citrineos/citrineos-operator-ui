// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { MessageInfosListQuery } from '../../graphql/types';
import { MessageInfo } from './MessageInfo';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  MESSAGE_INFOS_CREATE_MUTATION,
  MESSAGE_INFOS_DELETE_MUTATION,
  MESSAGE_INFOS_EDIT_MUTATION,
  MESSAGE_INFOS_GET_QUERY,
  MESSAGE_INFOS_LIST_QUERY,
} from './queries';
import { MESSAGE_INFOS_COLUMNS } from './table-config';
import { MessageInfos } from '../../graphql/schema.types';
import { IoInformationCircleSharp } from 'react-icons/io5';

export const MessageInfosView: React.FC = () => {
  return (
    <GenericView
      dtoClass={MessageInfo}
      gqlQuery={MESSAGE_INFOS_GET_QUERY}
      editMutation={MESSAGE_INFOS_EDIT_MUTATION}
      createMutation={MESSAGE_INFOS_CREATE_MUTATION}
      deleteMutation={MESSAGE_INFOS_DELETE_MUTATION}
    />
  );
};

export const MessageInfosList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<MessageInfosListQuery>({
    resource: ResourceType.MESSAGE_INFOS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: MESSAGE_INFOS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<MessageInfos, MessageInfosListQuery>
      tableProps={tableProps}
      columns={MESSAGE_INFOS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MessageInfosList />} />
      <Route path="/:id/*" element={<MessageInfosView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.MESSAGE_INFOS,
    list: '/message-infos',
    create: '/message-infos/new',
    show: '/message-infos/:id',
    edit: '/message-infos/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <IoInformationCircleSharp />,
  },
];
