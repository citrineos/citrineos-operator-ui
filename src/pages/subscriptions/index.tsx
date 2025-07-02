// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { SubscriptionsListQuery } from '../../graphql/types';
import { Subscription } from './Subscription';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  SUBSCRIPTIONS_CREATE_MUTATION,
  SUBSCRIPTIONS_DELETE_MUTATION,
  SUBSCRIPTIONS_EDIT_MUTATION,
  SUBSCRIPTIONS_GET_QUERY,
  SUBSCRIPTIONS_LIST_QUERY,
} from './queries';
import { SUBSCRIPTIONS_COLUMNS } from './table-config';
import { Subscriptions } from '../../graphql/schema.types';
import { LiaAssistiveListeningSystemsSolid } from 'react-icons/lia';

export const SubscriptionsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Subscription}
      gqlQuery={SUBSCRIPTIONS_GET_QUERY}
      editMutation={SUBSCRIPTIONS_EDIT_MUTATION}
      createMutation={SUBSCRIPTIONS_CREATE_MUTATION}
      deleteMutation={SUBSCRIPTIONS_DELETE_MUTATION}
    />
  );
};

export const SubscriptionsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<SubscriptionsListQuery>({
    resource: ResourceType.SUBSCRIPTIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: SUBSCRIPTIONS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<Subscriptions, SubscriptionsListQuery>
      tableProps={tableProps}
      columns={SUBSCRIPTIONS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SubscriptionsList />} />
      <Route path="/:id/*" element={<SubscriptionsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.SUBSCRIPTIONS,
    list: '/subscriptions',
    create: '/subscriptions/new',
    show: '/subscriptions/:id',
    edit: '/subscriptions/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <LiaAssistiveListeningSystemsSolid />,
  },
];
