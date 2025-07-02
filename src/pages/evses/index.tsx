// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../model/interfaces';
import {
  EVSE_CREATE_MUTATION,
  EVSE_DELETE_MUTATION,
  EVSE_EDIT_MUTATION,
  EVSE_GET_QUERY,
} from './queries';
import { Evse } from './Evse';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { TriggerMessageForEvseCustomAction } from '../../message/2.0.1/trigger-message';
import { BsFillInboxesFill } from 'react-icons/bs';

export const EvseView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Evse}
      gqlQuery={EVSE_GET_QUERY}
      editMutation={EVSE_EDIT_MUTATION}
      createMutation={EVSE_CREATE_MUTATION}
      deleteMutation={EVSE_DELETE_MUTATION}
    />
  );
};

export const EvseList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable
        dtoClass={Evse}
        customActions={[TriggerMessageForEvseCustomAction]}
      />
    </>
  );
};

// Routes Setup
export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<EvseList />} />
      <Route path="/:id/*" element={<EvseView />} />
    </Routes>
  );
};

// Resource Definition
export const resources = [
  {
    name: ResourceType.EVSES,
    list: '/evses',
    create: '/evses/new',
    show: '/evses/:id',
    edit: '/evses/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <BsFillInboxesFill />,
  },
];
