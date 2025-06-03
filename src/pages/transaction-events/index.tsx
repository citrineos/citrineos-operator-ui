// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericParameterizedView, GenericView } from '../../components/view';
import {
  TRANSACTION_EVENT_CREATE_MUTATION,
  TRANSACTION_EVENT_DELETE_MUTATION,
  TRANSACTION_EVENT_EDIT_MUTATION,
  TRANSACTION_EVENT_GET_QUERY,
} from './queries';
import { TransactionEvent } from './TransactionEvent';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { MdOutlineEventRepeat } from 'react-icons/md';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { GenericViewState } from '@enums';

export const TransactionEventView: React.FC = () => {
  return (
    <GenericView
      dtoClass={TransactionEvent}
      gqlQuery={TRANSACTION_EVENT_GET_QUERY}
      editMutation={TRANSACTION_EVENT_EDIT_MUTATION}
      createMutation={TRANSACTION_EVENT_CREATE_MUTATION}
      deleteMutation={TRANSACTION_EVENT_DELETE_MUTATION}
    />
  );
};

export const TransactionEventList = () => {
  return <GenericDataTable dtoClass={TransactionEvent} />;
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TransactionEventList />} />
      <Route path="/:id/*" element={<TransactionEventView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.TRANSACTION_EVENTS,
    list: '/transaction-events',
    create: '/transaction-events/new',
    show: '/transaction-events/:id',
    edit: '/transaction-events/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <MdOutlineEventRepeat />,
  },
];

export const renderAssociatedTransactionEventId = (
  _: any,
  record: {
    transactionEventId: string;
    [key: string]: any;
  },
) => {
  if (!record?.transactionEventId) {
    return '';
  }
  const transactionEventId = record.transactionEventId;
  return (
    <ExpandableColumn
      initialContent={transactionEventId}
      expandedContent={
        <GenericParameterizedView
          resourceType={ResourceType.TRANSACTION_EVENTS}
          id={transactionEventId}
          state={GenericViewState.SHOW}
          dtoClass={TransactionEvent}
          gqlQuery={TRANSACTION_EVENT_GET_QUERY}
        />
      }
      viewTitle={`Transaction Event linked with ID ${record.id}`}
    />
  );
};
