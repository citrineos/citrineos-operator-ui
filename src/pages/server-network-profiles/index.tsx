import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../components';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { ServerNetworkProfile } from './ServerNetworkProfile';
import {
  SERVER_NETWORK_PROFILE_CREATE_MUTATION,
  SERVER_NETWORK_PROFILE_DELETE_MUTATION,
  SERVER_NETWORK_PROFILE_EDIT_MUTATION,
  SERVER_NETWORK_PROFILE_GET_QUERY,
} from './queries';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '../../resource-type';
import { AiFillSignal } from 'react-icons/ai';

export const ServerNetworkProfileView: React.FC = () => {
  return (
    <GenericView
      dtoClass={ServerNetworkProfile}
      gqlQuery={SERVER_NETWORK_PROFILE_GET_QUERY}
      editMutation={SERVER_NETWORK_PROFILE_EDIT_MUTATION}
      createMutation={SERVER_NETWORK_PROFILE_CREATE_MUTATION}
      deleteMutation={SERVER_NETWORK_PROFILE_DELETE_MUTATION}
    />
  );
};

export const ServerNetworkProfileList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable
        dtoClass={ServerNetworkProfile}
      />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ServerNetworkProfileList />} />
      <Route path="/:id/*" element={<ServerNetworkProfileView />} />
    </Routes>
  );
};

// Resource Definition
export const resources = [
  {
    name: ResourceType.SERVER_NETWORK_PROFILES,
    list: '/server-network-profiles',
    create: '/server-network-profiles/new',
    show: '/server-network-profiles/:id',
    edit: '/server-network-profiles/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiFillSignal />,
  },
];
