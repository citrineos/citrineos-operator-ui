// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { StatusNotificationsListQuery } from '../../graphql/types';
import { StatusNotification } from './StatusNotification';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  STATUS_NOTIFICATIONS_CREATE_MUTATION,
  STATUS_NOTIFICATIONS_DELETE_MUTATION,
  STATUS_NOTIFICATIONS_EDIT_MUTATION,
  STATUS_NOTIFICATIONS_GET_QUERY,
  STATUS_NOTIFICATIONS_LIST_QUERY,
} from './queries';
import { STATUS_NOTIFICATIONS_COLUMNS } from './table-config';
import { StatusNotifications } from '../../graphql/schema.types';
import { MdOutlineNotificationsActive } from 'react-icons/md';

export const StatusNotificationsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={StatusNotification}
      gqlQuery={STATUS_NOTIFICATIONS_GET_QUERY}
      editMutation={STATUS_NOTIFICATIONS_EDIT_MUTATION}
      createMutation={STATUS_NOTIFICATIONS_CREATE_MUTATION}
      deleteMutation={STATUS_NOTIFICATIONS_DELETE_MUTATION}
    />
  );
};

export const StatusNotificationsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<StatusNotificationsListQuery>({
    resource: ResourceType.STATUS_NOTIFICATIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: STATUS_NOTIFICATIONS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<StatusNotifications, StatusNotificationsListQuery>
      tableProps={tableProps}
      columns={STATUS_NOTIFICATIONS_COLUMNS(
        !props.hideActions,
        props.parentView,
      )}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<StatusNotificationsList />} />
      <Route path="/:id/*" element={<StatusNotificationsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.STATUS_NOTIFICATIONS,
    list: '/status-notifications',
    create: '/status-notifications/new',
    show: '/status-notifications/:id',
    meta: {
      canDelete: true,
    },
    icon: <MdOutlineNotificationsActive />,
  },
];
