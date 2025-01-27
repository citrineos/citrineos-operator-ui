import React from 'react';
import { GenericView } from '../../components/view';
import { IDataModelListProps } from '../../model/interfaces';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { Route, Routes } from 'react-router-dom';
import { ResourceType } from '../../resource-type';
import { ContactsOutlined } from '@ant-design/icons';
import { Authorizations } from './authorizations';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_DELETE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_SHOW_QUERY,
} from './queries';

export const AuthorizationsView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Authorizations}
      gqlQuery={AUTHORIZATIONS_SHOW_QUERY}
      editMutation={AUTHORIZATIONS_EDIT_MUTATION}
      createMutation={AUTHORIZATIONS_CREATE_MUTATION}
      deleteMutation={AUTHORIZATIONS_DELETE_MUTATION}
    />
  );
};

export const AuthorizatiionsList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable dtoClass={Authorizations} />
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AuthorizatiionsList />} />
      <Route path="/:id/*" element={<AuthorizationsView />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.AUTHORIZATIONS,
    list: '/authorizations',
    create: '/authorizations/new',
    edit: '/authorizations/:id/edit',
    show: '/authorizations/:id',
    meta: {
      canDelete: true,
    },
    icon: <ContactsOutlined />,
  },
];
