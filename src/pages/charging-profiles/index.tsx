// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ResourceType } from '@util/auth';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { useTable } from '@refinedev/antd';
import { ChargingProfilesListQuery } from '../../graphql/types';
import { ChargingProfile } from './ChargingProfile';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { DEFAULT_SORTERS } from '../../components/defaults';
import {
  CHARGING_PROFILES_CREATE_MUTATION,
  CHARGING_PROFILES_DELETE_MUTATION,
  CHARGING_PROFILES_EDIT_MUTATION,
  CHARGING_PROFILES_GET_QUERY,
  CHARGING_PROFILES_LIST_QUERY,
} from './queries';
import { CHARGING_PROFILES_COLUMNS } from './table-config';
import { ChargingProfiles } from '../../graphql/schema.types';
import { AiOutlineProfile } from 'react-icons/ai';

export const ChargingProfilesView: React.FC = () => {
  return (
    <GenericView
      dtoClass={ChargingProfile}
      gqlQuery={CHARGING_PROFILES_GET_QUERY}
      editMutation={CHARGING_PROFILES_EDIT_MUTATION}
      createMutation={CHARGING_PROFILES_CREATE_MUTATION}
      deleteMutation={CHARGING_PROFILES_DELETE_MUTATION}
    />
  );
};

export const ChargingProfilesList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<ChargingProfilesListQuery>({
    resource: ResourceType.CHARGING_PROFILES,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: CHARGING_PROFILES_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<ChargingProfiles, ChargingProfilesListQuery>
      tableProps={tableProps}
      columns={CHARGING_PROFILES_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ChargingProfilesList />} />
      <Route path="/:id/*" element={<ChargingProfilesView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.CHARGING_PROFILES,
    list: '/charging-profiles',
    create: '/charging-profiles/new',
    show: '/charging-profiles/:id',
    edit: '/charging-profiles/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiOutlineProfile />,
  },
];
