import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../components';
import {
  EVSE_CREATE_MUTATION,
  EVSE_DELETE_MUTATION,
  EVSE_EDIT_MUTATION,
  EVSE_GET_QUERY,
} from './queries';
import { Evse } from './Evse';
import { GenericDataTable } from '../../components/data-model-table/editable';

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

export const EvseList = (props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable dtoClass={Evse} />
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
    meta: {
      canDelete: true,
    },
  },
];
