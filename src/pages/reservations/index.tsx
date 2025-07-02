// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { ReservationsListQuery } from '../../graphql/types';
import { Reservation } from './Reservation';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  RESERVATIONS_CREATE_MUTATION,
  RESERVATIONS_DELETE_MUTATION,
  RESERVATIONS_EDIT_MUTATION,
  RESERVATIONS_GET_QUERY,
  RESERVATIONS_LIST_QUERY,
} from './queries';
import { RESERVATIONS_COLUMNS } from './table-config';
import { Reservations } from '../../graphql/schema.types';
import { AiTwotoneCalendar } from 'react-icons/ai';

export const ReservationsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Reservation}
      gqlQuery={RESERVATIONS_GET_QUERY}
      editMutation={RESERVATIONS_EDIT_MUTATION}
      createMutation={RESERVATIONS_CREATE_MUTATION}
      deleteMutation={RESERVATIONS_DELETE_MUTATION}
    />
  );
};

export const ReservationsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<ReservationsListQuery>({
    resource: ResourceType.RESERVATIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: RESERVATIONS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<Reservations, ReservationsListQuery>
      tableProps={tableProps}
      columns={RESERVATIONS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ReservationsList />} />
      <Route path="/:id/*" element={<ReservationsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.RESERVATIONS,
    list: '/reservations',
    create: '/reservations/new',
    show: '/reservations/:id',
    edit: '/reservations/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiTwotoneCalendar />,
  },
];
