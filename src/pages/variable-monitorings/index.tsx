// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { VariableMonitoringsListQuery } from '../../graphql/types';
import { VariableMonitoring } from './VariableMonitoring';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  VARIABLE_MONITORINGS_CREATE_MUTATION,
  VARIABLE_MONITORINGS_DELETE_MUTATION,
  VARIABLE_MONITORINGS_EDIT_MUTATION,
  VARIABLE_MONITORINGS_GET_QUERY,
  VARIABLE_MONITORINGS_LIST_QUERY,
} from './queries';
import { VARIABLE_MONITORINGS_COLUMNS } from './table-config';
import { VariableMonitorings } from '../../graphql/schema.types';
import { AiOutlineMonitor } from 'react-icons/ai';

export const VariableMonitoringsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={VariableMonitoring}
      gqlQuery={VARIABLE_MONITORINGS_GET_QUERY}
      editMutation={VARIABLE_MONITORINGS_EDIT_MUTATION}
      createMutation={VARIABLE_MONITORINGS_CREATE_MUTATION}
      deleteMutation={VARIABLE_MONITORINGS_DELETE_MUTATION}
    />
  );
};

export const VariableMonitoringsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<VariableMonitoringsListQuery>({
    resource: ResourceType.VARIABLE_MONITORINGS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: VARIABLE_MONITORINGS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<VariableMonitorings, VariableMonitoringsListQuery>
      tableProps={tableProps}
      columns={VARIABLE_MONITORINGS_COLUMNS(
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
      <Route index element={<VariableMonitoringsList />} />
      <Route path="/:id/*" element={<VariableMonitoringsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.VARIABLE_MONITORINGS,
    list: '/variable-monitorings',
    create: '/variable-monitorings/new',
    show: '/variable-monitorings/:id',
    edit: '/variable-monitorings/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiOutlineMonitor />,
  },
];
