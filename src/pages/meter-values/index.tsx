// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { MeterValue } from './MeterValue';
import { IDataModelListProps } from '../../model/interfaces';
import {
  METER_VALUE_CREATE_MUTATION,
  METER_VALUE_DELETE_MUTATION,
  METER_VALUE_EDIT_MUTATION,
  METER_VALUE_GET_QUERY,
} from './queries';
import { BsSpeedometer } from 'react-icons/bs';
import { GenericDataTable } from '../../components/data-model-table/editable';

export const MeterValueView: React.FC = () => {
  return (
    <GenericView
      dtoClass={MeterValue}
      gqlQuery={METER_VALUE_GET_QUERY}
      editMutation={METER_VALUE_EDIT_MUTATION}
      createMutation={METER_VALUE_CREATE_MUTATION}
      deleteMutation={METER_VALUE_DELETE_MUTATION}
    />
  );
};

export const MeterValueList = (_props: IDataModelListProps) => {
  return <GenericDataTable dtoClass={MeterValue} editable={false} />;
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MeterValueList />} />
      <Route path="/:id/*" element={<MeterValueView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.METER_VALUES,
    list: '/meter-values',
    create: '/meter-values/new',
    show: '/meter-values/:id',
    meta: {
      canDelete: true,
    },
    icon: <BsSpeedometer />,
  },
];
